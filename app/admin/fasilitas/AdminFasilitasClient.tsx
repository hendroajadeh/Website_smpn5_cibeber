'use client';

import { useState, useTransition } from 'react';
import type { Facility } from '@prisma/client';
import { Plus, PencilSimple, Trash, Buildings, X } from '@phosphor-icons/react';
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Fasilitas' : 'Tambah Fasilitas'}</h2>
              <button onClick={closeForm} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label label-required">Nama Fasilitas</label>
                <input name="name" type="text" required defaultValue={editing?.name} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label">Deskripsi</label>
                <textarea name="description" rows={3} defaultValue={editing?.description ?? ''} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label label-required">Kategori</label>
                <select name="category" defaultValue={editing?.category ?? 'UMUM'} className="input" disabled={isPending}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Gambar</label>
                <input name="image" type="file" accept="image/*" className="input text-xs" disabled={isPending} />
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fasilitas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{facilities.length} item</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary"><Plus size={15} weight="bold" />Tambah Fasilitas</button>
      </div>

      {facilities.length === 0 ? (
        <div className="card p-16 text-center">
          <Buildings size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Belum ada data fasilitas.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead><tr><th>Nama</th><th>Kategori</th><th>Urutan</th><th className="text-right">Aksi</th></tr></thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <p className="font-medium text-slate-900 text-sm">{f.name}</p>
                      {f.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{f.description}</p>}
                    </td>
                    <td><span className="badge badge-gray">{getCategoryLabel(f.category)}</span></td>
                    <td className="font-mono text-xs text-slate-400">{f.order}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(f)} className="btn btn-ghost btn-sm"><PencilSimple size={14} /></button>
                        <button onClick={() => setDeleteId(f.id)} className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"><Trash size={14} /></button>
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
