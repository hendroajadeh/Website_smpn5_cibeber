'use client';

import { useState, useTransition } from 'react';
import type { Facility } from '@prisma/client';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createFacility, updateFacility, deleteFacility } from '@/actions/content';
import { getCategoryLabel } from '@/lib/utils';

type Props = { facilities: Facility[] };
const CATEGORIES = ['AKADEMIK', 'OLAHRAGA', 'SENI', 'IBADAH', 'KESEHATAN', 'PENDUKUNG', 'UMUM'];

export default function AdminFasilitasClient({ facilities: initial }: Props) {
  const [facilities, setFacilities] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(f: Facility) { setEditing(f); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editing
        ? await updateFacility(editing.id, formData)
        : await createFacility(formData);
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
      const result = await deleteFacility(id);
      setDeleteId(null);
      if (result.success) {
        setFacilities((prev) => prev.filter((f) => f.id !== id));
        setToast({ message: 'Fasilitas dihapus', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmDialog title="Hapus Fasilitas" message="Lanjutkan menghapus fasilitas ini?" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} loading={isPending} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white p-6 w-full max-w-md rounded-2xl shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Fasilitas/Ekskul' : 'Tambah Fasilitas/Ekskul'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Fasilitas / Ekstrakurikuler</label>
                <input name="name" type="text" required defaultValue={editing?.name} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
                <select name="category" defaultValue={editing?.category ?? 'UMUM'} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 bg-white" disabled={isPending}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                <textarea name="description" rows={3} defaultValue={editing?.description ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gambar</label>
                <input name="image" type="file" accept="image/*" className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG, WebP. Maks. 2MB</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutan</label>
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
            <h3 className="text-base font-bold text-slate-900">Sarana, Prasarana & Ekstrakurikuler</h3>
            <p className="text-xs text-slate-500">Kelola daftar laboratorium, perpustakaan, lapangan olahraga, dan ragam ekskul siswa.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[17px]">add</span> Tambah Data
          </button>
        </div>

        {facilities.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <span className="material-symbols-outlined text-4xl text-slate-300">apartment</span>
            <p className="text-sm font-semibold text-slate-500 mt-2">Belum ada data fasilitas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between group hover:border-teal-200 transition-colors">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800">{f.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">{getCategoryLabel(f.category)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">{f.description || 'Tidak ada deskripsi'}</p>
                </div>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(f)} className="text-xs text-slate-600 hover:text-teal-600 font-semibold">Sunting</button>
                  <button onClick={() => setDeleteId(f.id)} className="text-xs text-rose-600 hover:text-rose-700 font-semibold">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
