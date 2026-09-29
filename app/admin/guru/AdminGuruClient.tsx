'use client';

import { useState, useTransition } from 'react';
import type { Staff } from '@prisma/client';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createStaff, updateStaff, deleteStaff } from '@/actions/staff-settings';

type Props = { staff: Staff[] };
const LEVELS = [{ value: 1, label: 'Pimpinan (Kepala Sekolah)' }, { value: 2, label: 'Wakil & Staf' }, { value: 3, label: 'Tenaga Pendidik' }];

export default function AdminGuruClient({ staff: initial }: Props) {
  const [staff, setStaff] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(s: Staff) { setEditing(s); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleStaffSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editing
        ? await updateStaff(editing.id, formData)
        : await createStaff(formData);
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
      const result = await deleteStaff(id);
      setDeleteId(null);
      if (result.success) {
        setStaff((prev) => prev.filter((s) => s.id !== id));
        setToast({ message: 'Staff dihapus', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && <ConfirmDialog title="Hapus Staff" message="Lanjutkan menghapus data staff ini?" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} loading={isPending} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white p-6 w-full max-w-md rounded-2xl shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Staff' : 'Tambah Tenaga Pendidik'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap & Gelar</label>
                <input name="name" type="text" required defaultValue={editing?.name} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran / Jabatan</label>
                <input name="position" type="text" required defaultValue={editing?.position} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Level Struktural</label>
                <select name="level" defaultValue={editing?.level ?? 3} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 bg-white" disabled={isPending}>
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">NIP</label>
                  <input name="nip" type="text" defaultValue={editing?.nip ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 font-mono" disabled={isPending} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutan Tampil</label>
                  <input name="order" type="number" min="0" defaultValue={editing?.order ?? 0} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Profil</label>
                <input name="image" type="file" accept="image/*" className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG, WebP. Maks. 2MB</p>
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
            <h3 className="text-base font-bold text-slate-900">Dewan Pendidik & Tenaga Kependidikan</h3>
            <p className="text-xs text-slate-500">Kelola foto guru, mata pelajaran, dan jabatan struktural.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[17px]">person_add</span> Tambah Tenaga Pendidik
          </button>
        </div>

        {staff.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <span className="material-symbols-outlined text-4xl text-slate-300">groups</span>
            <p className="text-sm font-semibold text-slate-500 mt-2">Belum ada data guru/staf.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3.5 group transition-colors hover:border-teal-200 hover:bg-teal-50/30">
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{s.name}</h4>
                  <p className="text-[11px] text-teal-600 font-semibold truncate">{s.position}</p>
                  <p className="text-[10px] text-slate-400">{LEVELS.find(l => l.value === s.level)?.label}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-teal-600 p-1 rounded hover:bg-teal-50"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                  <button onClick={() => setDeleteId(s.id)} className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
