'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Gallery } from '@prisma/client';
import { Plus, PencilSimple, Trash, Images, X } from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createGallery, updateGallery, deleteGallery } from '@/actions/content';
import { getCategoryLabel } from '@/lib/utils';

type Props = { galleries: Gallery[] };

const CATEGORIES = ['UMUM', 'PRESTASI', 'KEGIATAN', 'FASILITAS'];

export default function AdminGaleriClient({ galleries: initial }: Props) {
  const [galleries, setGalleries] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  function openCreate() { setEditing(null); setPreviewImage(null); setShowForm(true); }
  function openEdit(g: Gallery) { setEditing(g); setPreviewImage(g.imageUrl); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); setPreviewImage(null); }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editing
        ? await updateGallery(editing.id, formData)
        : await createGallery(formData);
      if (result.success) {
        setToast({ message: result.message ?? 'Berhasil', type: 'success' });
        closeForm();
        window.location.reload();
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteGallery(id);
      setDeleteId(null);
      if (result.success) {
        setGalleries((prev) => prev.filter((g) => g.id !== id));
        setToast({ message: 'Item galeri dihapus', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmDialog
          title="Hapus Item Galeri"
          message="Item yang dihapus tidak dapat dikembalikan. Lanjutkan?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
          loading={isPending}
        />
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Item' : 'Tambah Item'}</h2>
              <button onClick={closeForm} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label label-required">Judul</label>
                <input name="title" type="text" required defaultValue={editing?.title} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label">Deskripsi</label>
                <textarea name="description" rows={2} defaultValue={editing?.description ?? ''} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label label-required">Kategori</label>
                <select name="category" defaultValue={editing?.category ?? 'UMUM'} className="input" disabled={isPending}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label label-required">Gambar</label>
                {previewImage && (
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-2">
                    <img src={previewImage} alt="" className="object-cover w-full h-full" />
                  </div>
                )}
                <input name="image" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreviewImage(URL.createObjectURL(f)); }} className="input text-xs" disabled={isPending} required={!editing} />
                <p className="form-hint">JPG, PNG, WebP. Maks. 2MB</p>
              </div>
              <div className="form-group">
                <label className="label">Urutan</label>
                <input name="order" type="number" min="0" defaultValue={editing?.order ?? 0} className="input" disabled={isPending} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeForm} disabled={isPending} className="btn btn-secondary flex-1">Batal</button>
                <button type="submit" disabled={isPending} className="btn btn-primary flex-1">
                  {isPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Galeri</h1>
          <p className="text-sm text-slate-500 mt-0.5">{galleries.length} item</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={15} weight="bold" />
          Tambah Item
        </button>
      </div>

      {galleries.length === 0 ? (
        <div className="card p-16 text-center">
          <Images size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Belum ada item di galeri.</p>
          <button onClick={openCreate} className="btn btn-primary btn-sm mt-4 mx-auto">Tambah Item</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((g) => (
            <div key={g.id} className="card overflow-hidden p-0">
              <div className="aspect-square relative bg-slate-100">
                <Image src={g.imageUrl} alt={g.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => openEdit(g)} className="btn btn-sm bg-white/90 text-slate-700 border-0 shadow-sm p-1.5 rounded-md">
                    <PencilSimple size={12} />
                  </button>
                  <button onClick={() => setDeleteId(g.id)} className="btn btn-sm bg-white/90 text-red-500 border-0 shadow-sm p-1.5 rounded-md">
                    <Trash size={12} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-900 truncate">{g.title}</p>
                <span className="badge badge-brand mt-1">{getCategoryLabel(g.category)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
