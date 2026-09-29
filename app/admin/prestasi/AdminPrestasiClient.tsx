'use client';

import { useState, useTransition } from 'react';
import type { Achievement } from '@prisma/client';
import { Plus, PencilSimple, Trash, Trophy, X } from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createAchievement, updateAchievement, deleteAchievement } from '@/actions/content';
import { getLevelBadge } from '@/lib/utils';

type Props = { achievements: Achievement[] };
const LEVELS = ['SEKOLAH', 'KECAMATAN', 'KOTA', 'PROVINSI', 'NASIONAL', 'INTERNASIONAL'];
const LEVEL_LABELS: Record<string, string> = { SEKOLAH: 'Sekolah', KECAMATAN: 'Kecamatan', KOTA: 'Kab/Kota', PROVINSI: 'Provinsi', NASIONAL: 'Nasional', INTERNASIONAL: 'Internasional' };

export default function AdminPrestasiClient({ achievements: initial }: Props) {
  const [achievements, setAchievements] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(a: Achievement) { setEditing(a); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editing
        ? await updateAchievement(editing.id, formData)
        : await createAchievement(formData);
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
      const result = await deleteAchievement(id);
      setDeleteId(null);
      if (result.success) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
        setToast({ message: 'Prestasi dihapus', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmDialog title="Hapus Prestasi" message="Lanjutkan menghapus data prestasi ini?" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} loading={isPending} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{editing ? 'Edit Prestasi' : 'Tambah Prestasi'}</h2>
              <button onClick={closeForm} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label label-required">Judul Prestasi</label>
                <input name="title" type="text" required defaultValue={editing?.title} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label">Deskripsi</label>
                <textarea name="description" rows={2} defaultValue={editing?.description ?? ''} className="input" disabled={isPending} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label label-required">Tingkat</label>
                  <select name="level" defaultValue={editing?.level ?? 'KOTA'} className="input" disabled={isPending}>
                    {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label label-required">Tahun</label>
                  <input name="year" type="number" min="2000" max="2100" required defaultValue={editing?.year ?? new Date().getFullYear()} className="input" disabled={isPending} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Foto Prestasi (Opsional)</label>
                <input name="image" type="file" accept="image/*" className="input text-xs" disabled={isPending} />
                {editing?.imageUrl && (
                  <p className="form-hint mt-1">Biarkan kosong jika tidak ingin mengubah foto.</p>
                )}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Prestasi</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">{achievements.length} item</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary"><Plus size={15} weight="bold" />Tambah Prestasi</button>
      </div>

      {achievements.length === 0 ? (
        <div className="card p-16 text-center">
          <Trophy size={36} className="text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">Belum ada data prestasi.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead><tr><th>Prestasi</th><th>Tingkat</th><th>Tahun</th><th className="text-right">Aksi</th></tr></thead>
              <tbody>
                {achievements.map((a) => {
                  const { label, class: badgeClass } = getLevelBadge(a.level);
                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {a.imageUrl && (
                            <img src={a.imageUrl} alt={a.title} className="w-10 h-10 object-cover rounded shadow-sm bg-slate-100" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-zinc-100 text-sm">{a.title}</p>
                            {a.description && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 truncate max-w-xs">{a.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${badgeClass}`}>{label}</span></td>
                      <td className="font-mono text-xs text-slate-400">{a.year}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(a)} className="btn btn-ghost btn-sm"><PencilSimple size={14} /></button>
                          <button onClick={() => setDeleteId(a.id)} className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"><Trash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
