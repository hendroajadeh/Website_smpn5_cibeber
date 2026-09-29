'use client';

import { useState, useTransition } from 'react';
import type { Article } from '@prisma/client';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { deleteArticle, toggleArticlePublish } from '@/actions/articles';
import ArticleForm from './ArticleForm';
import { formatDateShort } from '@/lib/utils';

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

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Artikel & Berita Terkini</h3>
            <p className="text-xs text-slate-500">Kelola artikel prestasi, liputan kegiatan, dan dokumentasi sekolah.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[17px]">post_add</span> Tulis Artikel Baru
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <span className="material-symbols-outlined text-4xl text-slate-300">newspaper</span>
            <p className="text-sm font-semibold text-slate-500 mt-2">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col group transition-colors hover:border-teal-200">
                <div className="h-36 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center text-slate-400">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl">newspaper</span>
                  )}
                  {!article.published && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Draft</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">Berita</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{article.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{article.excerpt || 'Tidak ada ringkasan.'}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">{formatDateShort(article.createdAt)}</span>
                    <div className="space-x-2">
                      <button onClick={() => handleTogglePublish(article.id)} disabled={isPending} className="text-slate-600 hover:text-teal-600 font-bold" title={article.published ? "Jadikan Draft" : "Publikasikan"}>
                        {article.published ? 'Hide' : 'Publish'}
                      </button>
                      <button onClick={() => openEdit(article)} className="text-slate-600 hover:text-slate-900 font-bold">Edit</button>
                      <button onClick={() => setDeleteId(article.id)} className="text-rose-600 hover:text-rose-700 font-bold">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
