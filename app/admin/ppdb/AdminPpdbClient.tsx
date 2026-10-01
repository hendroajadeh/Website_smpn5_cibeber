'use client';

import { useState, useTransition } from 'react';
import type { PpdbStep } from '@prisma/client';
import { Plus, PencilSimple, Trash, UsersFour, X } from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createPpdbStep, updatePpdbStep, deletePpdbStep } from '@/actions/content';
import { updateSettings } from '@/actions/staff-settings';

type Props = { steps: PpdbStep[]; settings: Record<string, string> };

export default function AdminPpdbClient({ steps: initial, settings: initialSettings }: Props) {
  const [steps, setSteps] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PpdbStep | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [settingsPending, startSettingsTransition] = useTransition();

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(s: PpdbStep) { setEditing(s); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleStepSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editing
        ? await updatePpdbStep(editing.id, formData)
        : await createPpdbStep(formData);
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
      const result = await deletePpdbStep(id);
      setDeleteId(null);
      if (result.success) {
        setSteps((prev) => prev.filter((s) => s.id !== id));
        setToast({ message: 'Langkah dihapus', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  function handleSettingsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startSettingsTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        setToast({ message: 'Pengaturan PPDB disimpan', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmDialog title="Hapus Langkah" message="Lanjutkan menghapus langkah PPDB ini?" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} loading={isPending} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Langkah' : 'Tambah Langkah'}</h2>
              <button onClick={closeForm} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleStepSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label label-required">Judul Langkah</label>
                <input name="title" type="text" required defaultValue={editing?.title} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label label-required">Deskripsi</label>
                <textarea name="description" rows={3} required defaultValue={editing?.description} className="input" disabled={isPending} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label label-required">Nomor Urut</label>
                  <input name="stepOrder" type="number" min="1" required defaultValue={editing?.stepOrder ?? steps.length + 1} className="input" disabled={isPending} />
                </div>
                <div className="form-group">
                  <label className="label">Icon</label>
                  <select name="icon" defaultValue={editing?.icon ?? 'file-text'} className="input" disabled={isPending}>
                    {['user-plus', 'file-text', 'upload-simple', 'check-circle', 'megaphone', 'check-square'].map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
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

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PPDB</h1>

      {/* Jadwal Settings */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 text-sm mb-4">Jadwal & Informasi PPDB</h2>
        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'ppdb_year', label: 'Tahun Ajaran' },
              { key: 'ppdb_quota', label: 'Kuota Siswa' },
              { key: 'ppdb_open_date', label: 'Tanggal Buka' },
              { key: 'ppdb_close_date', label: 'Tanggal Tutup' },
              { key: 'ppdb_announcement_date', label: 'Tanggal Pengumuman' },
              { key: 'ppdb_registration_date', label: 'Tanggal Daftar Ulang' },
            ].map((field) => (
              <div key={field.key} className="form-group">
                <label className="label">{field.label}</label>
                <input name={field.key} type="text" defaultValue={initialSettings[field.key] ?? ''} className="input" disabled={settingsPending} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="label">Info Tambahan</label>
            <textarea name="ppdb_info" rows={3} defaultValue={initialSettings.ppdb_info ?? ''} className="input" disabled={settingsPending} />
          </div>
          <button type="submit" disabled={settingsPending} className="btn btn-primary">
            {settingsPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {settingsPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Langkah Pendaftaran</h2>
          <p className="text-sm text-slate-500 mt-0.5">{steps.length} langkah</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm"><Plus size={14} weight="bold" />Tambah Langkah</button>
      </div>

      {steps.length === 0 ? (
        <div className="card p-16 text-center">
          <UsersFour size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Belum ada langkah PPDB.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead><tr><th>No</th><th>Langkah</th><th>Icon</th><th className="text-right">Aksi</th></tr></thead>
              <tbody>
                {steps.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono font-bold text-[#1e3a8a]">{s.stepOrder}</td>
                    <td>
                      <p className="font-medium text-slate-900 text-sm">{s.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{s.description}</p>
                    </td>
                    <td className="font-mono text-xs text-slate-400">{s.icon}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="btn btn-ghost btn-sm"><PencilSimple size={14} /></button>
                        <button onClick={() => setDeleteId(s.id)} className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"><Trash size={14} /></button>
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
