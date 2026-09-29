'use client';

import { useState, useTransition } from 'react';
import type { Gallery } from '@prisma/client';
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
        <ConfirmDialog title="Hapus Item Galeri" message="Item yang dihapus tidak dapat dikembalikan. Lanjutkan?" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} loading={isPending} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white p-6 w-full max-w-md rounded-2xl shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul</label>
                <input name="title" type="text" required defaultValue={editing?.title} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                <textarea name="description" rows={2} defaultValue={editing?.description ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
                <select name="category" defaultValue={editing?.category ?? 'UMUM'} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 bg-white" disabled={isPending}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Foto</label>
                {previewImage && (
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-2 border border-slate-200">
                    <img src={previewImage} alt="" className="object-cover w-full h-full" />
                  </div>
                )}
                <input name="image" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreviewImage(URL.createObjectURL(f)); }} className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} required={!editing} />
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG, WebP. Maks. 2MB</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutan Tampil</label>
                <input name="order" type="number" min="0" defaultValue={editing?.order ?? 0} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeForm} disabled={isPending} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold transition-all hover:bg-slate-50 flex-1">Batal</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center justify-center flex-1 gap-2">
                  {isPending && <span className="inline-block h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Dokumentasi & Galeri Foto</h3>
            <p className="text-xs text-slate-500">Kelola album foto kegiatan, sarana, dan prestasi sekolah.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[17px]">add_photo_alternate</span> Tambah Foto
          </button>
        </div>

        {galleries.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <span className="material-symbols-outlined text-4xl text-slate-300">images</span>
            <p className="text-sm font-semibold text-slate-500 mt-2">Belum ada item di galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleries.map((g) => (
              <div key={g.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col group transition-colors hover:border-teal-200">
                <div className="aspect-square w-full bg-slate-200 relative overflow-hidden flex items-center justify-center text-slate-400">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">{getCategoryLabel(g.category)}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 truncate">{g.title}</h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-end text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="space-x-1">
                      <button onClick={() => openEdit(g)} className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-200"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                      <button onClick={() => setDeleteId(g.id)} className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-100"><span className="material-symbols-outlined text-[16px]">delete</span></button>
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
