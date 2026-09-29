'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Article } from '@prisma/client';
import {
  Plus, PencilSimple, Trash, Eye, EyeSlash, Newspaper,
} from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { deleteArticle, toggleArticlePublish } from '@/actions/articles';
import ArticleForm from './ArticleForm';
import { formatDateShort, slugify } from '@/lib/utils';

type Props = { articles: Article[] };

export default function AdminBeritaClient({ articles: initial }: Props) {
  const [articles, setArticles] = useState(initial);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
  }

  function openCreate() {
    setEditing(null);
    setView('form');
  }

  function openEdit(article: Article) {
    setEditing(article);
    setView('form');
  }

  function onFormSuccess() {
    setView('list');
    // Reload page to get fresh data
    window.location.reload();
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteArticle(id);
      setDeleteId(null);
      if (result.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Berita berhasil dihapus', 'success');
      } else {
        showToast(result.error, 'error');
      }
    });
  }

  function handleTogglePublish(id: string) {
    startTransition(async () => {
      const result = await toggleArticlePublish(id);
      if (result.success) {
        setArticles((prev) =>
          prev.map((a) => a.id === id ? { ...a, published: !a.published } : a)
        );
        showToast(result.message ?? 'Berhasil', 'success');
      } else {
        showToast(result.error, 'error');
      }
    });
  }

  if (view === 'form') {
    return (
      <ArticleForm
        article={editing}
        onSuccess={onFormSuccess}
        onCancel={() => setView('list')}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      {deleteId && (
        <ConfirmDialog
          title="Hapus Berita"
          message="Berita yang dihapus tidak dapat dikembalikan. Lanjutkan?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
          loading={isPending}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Berita</h1>
          <p className="text-sm text-slate-500 mt-0.5">{articles.length} artikel</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={15} weight="bold" />
          Tambah Berita
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="card p-16 text-center">
          <Newspaper size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Belum ada berita.</p>
          <button onClick={openCreate} className="btn btn-primary btn-sm mt-4 mx-auto">
            Tambah Berita Pertama
          </button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Berita</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md overflow-hidden bg-slate-100 shrink-0">
                          {article.imageUrl ? (
                            <Image src={article.imageUrl} alt="" width={64} height={48} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Newspaper size={14} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate max-w-xs">{article.title}</p>
                          <p className="text-xs text-slate-400 font-mono truncate max-w-xs">{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${article.published ? 'badge-success' : 'badge-gray'}`}>
                        {article.published ? 'Publik' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400 font-mono whitespace-nowrap">
                      {formatDateShort(article.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTogglePublish(article.id)}
                          disabled={isPending}
                          className="btn btn-ghost btn-sm"
                          title={article.published ? 'Sembunyikan' : 'Publikasikan'}
                        >
                          {article.published ? <EyeSlash size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => openEdit(article)}
                          className="btn btn-ghost btn-sm"
                          title="Edit"
                        >
                          <PencilSimple size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(article.id)}
                          className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                          title="Hapus"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
