'use client';

import { useState, useTransition } from 'react';
import type { Staff } from '@prisma/client';
import { Plus, PencilSimple, Trash, Users, X } from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createStaff, updateStaff, deleteStaff, updateSettings } from '@/actions/staff-settings';

type Props = { staff: Staff[]; settings: Record<string, string> };
const LEVELS = [{ value: 1, label: 'Pimpinan (Kepala Sekolah)' }, { value: 2, label: 'Wakil & Staf' }, { value: 3, label: 'Tenaga Pendidik' }];

export default function AdminProfilClient({ staff: initial, settings: initialSettings }: Props) {
  const [staff, setStaff] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [settingsPending, startSettingsTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'staff' | 'settings'>('staff');

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

  function handleSettingsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startSettingsTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        setToast({ message: 'Profil sekolah disimpan', type: 'success' });
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">{editing ? 'Edit Staff' : 'Tambah Staff'}</h2>
              <button onClick={closeForm} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label label-required">Nama</label>
                <input name="name" type="text" required defaultValue={editing?.name} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label label-required">Jabatan</label>
                <input name="position" type="text" required defaultValue={editing?.position} className="input" disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label label-required">Level</label>
                <select name="level" defaultValue={editing?.level ?? 3} className="input" disabled={isPending}>
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">NIP</label>
                  <input name="nip" type="text" defaultValue={editing?.nip ?? ''} className="input font-mono text-xs" disabled={isPending} />
                </div>
                <div className="form-group">
                  <label className="label">Urutan</label>
                  <input name="order" type="number" min="0" defaultValue={editing?.order ?? 0} className="input" disabled={isPending} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Pendidikan</label>
                <input name="education" type="text" defaultValue={editing?.education ?? ''} className="input" placeholder="S1 Pendidikan..." disabled={isPending} />
              </div>
              <div className="form-group">
                <label className="label">Foto</label>
                <input name="image" type="file" accept="image/*" className="input text-xs" disabled={isPending} />
                <p className="form-hint">JPG, PNG, WebP. Maks. 2MB</p>
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profil & Staf</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {([['staff', 'Data Staf'], ['settings', 'Info Sekolah']] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'staff' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{staff.length} orang</p>
            <button onClick={openCreate} className="btn btn-primary btn-sm"><Plus size={14} weight="bold" />Tambah Staff</button>
          </div>
          {staff.length === 0 ? (
            <div className="card p-16 text-center">
              <Users size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">Belum ada data staf.</p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="table-container border-0 rounded-none">
                <table className="table">
                  <thead><tr><th>Nama</th><th>Jabatan</th><th>Level</th><th>NIP</th><th className="text-right">Aksi</th></tr></thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id}>
                        <td className="font-medium text-slate-900 text-sm">{s.name}</td>
                        <td className="text-xs text-slate-500">{s.position}</td>
                        <td><span className="badge badge-gray">{LEVELS.find(l => l.value === s.level)?.label.split(' ')[0]}</span></td>
                        <td className="font-mono text-xs text-slate-400">{s.nip ?? '-'}</td>
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
        </>
      )}

      {activeTab === 'settings' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Informasi & Profil Sekolah</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'headmaster_name', label: 'Nama Kepala Sekolah' },
                { key: 'headmaster_nip', label: 'NIP Kepala Sekolah' },
              ].map((f) => (
                <div key={f.key} className="form-group">
                  <label className="label">{f.label}</label>
                  <input name={f.key} type="text" defaultValue={initialSettings[f.key] ?? ''} className="input" disabled={settingsPending} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label className="label">Sambutan Kepala Sekolah</label>
              <textarea name="headmaster_welcome" rows={6} defaultValue={initialSettings.headmaster_welcome ?? ''} className="input" disabled={settingsPending} />
            </div>
            <div className="form-group">
              <label className="label">Visi Sekolah</label>
              <textarea name="school_vision" rows={3} defaultValue={initialSettings.school_vision ?? ''} className="input" disabled={settingsPending} />
            </div>
            <div className="form-group">
              <label className="label">Misi Sekolah</label>
              <textarea name="school_mission" rows={6} defaultValue={initialSettings.school_mission ?? ''} className="input" disabled={settingsPending} />
              <p className="form-hint">Tulis setiap poin misi di baris baru</p>
            </div>
            <div className="form-group">
              <label className="label">Sejarah Sekolah</label>
              <textarea name="school_history" rows={4} defaultValue={initialSettings.school_history ?? ''} className="input" disabled={settingsPending} />
            </div>
            <div className="form-group">
              <label className="label">URL Embed Google Maps</label>
              <input name="maps_embed_url" type="text" defaultValue={initialSettings.maps_embed_url ?? ''} className="input font-mono text-xs" placeholder="https://www.google.com/maps/embed?pb=..." disabled={settingsPending} />
            </div>
            <button type="submit" disabled={settingsPending} className="btn btn-primary">
              {settingsPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {settingsPending ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
