'use client';

import { useState, useTransition } from 'react';
import type { PpdbApplicant, PpdbStep } from '@prisma/client';
import { Plus, PencilSimple, Trash, UsersFour, X } from '@phosphor-icons/react';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { createPpdbStep, updatePpdbStep, deletePpdbStep } from '@/actions/content';
import { updateSettings } from '@/actions/staff-settings';
import { updateApplicantStatus } from '@/actions/applicants';

type Props = { applicants: PpdbApplicant[]; steps: PpdbStep[]; settings: Record<string, string> };

export default function AdminPpdbClient({ applicants: initialApplicants, steps: initialSteps, settings: initialSettings }: Props) {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [steps, setSteps] = useState(initialSteps);
  const [showForm, setShowForm] = useState(false);
  const [editingStep, setEditingStep] = useState<PpdbStep | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [settingsPending, startSettingsTransition] = useTransition();

  // Applicant Logic
  function handleStatusChange(id: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateApplicantStatus(id, newStatus);
      if (result.success) {
        setApplicants((prev) => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setToast({ message: 'Status berhasil diubah', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'MENUNGGU': return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Menunggu Verifikasi</span>;
      case 'TERVERIFIKASI': return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Berkas Terverifikasi</span>;
      case 'DITERIMA': return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Diterima</span>;
      case 'DITOLAK': return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">Tidak Diterima</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">{status}</span>;
    }
  }

  function getPathwayBadge(pathway: string) {
    switch (pathway) {
      case 'ZONASI': return <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">Zonasi</span>;
      case 'PRESTASI': return <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">Prestasi</span>;
      case 'AFIRMASI': return <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">Afirmasi</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">{pathway}</span>;
    }
  }

  // Step Logic
  function openCreate() { setEditingStep(null); setShowForm(true); }
  function openEdit(s: PpdbStep) { setEditingStep(s); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingStep(null); }

  function handleStepSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = editingStep
        ? await updatePpdbStep(editingStep.id, formData)
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

  // Settings Logic
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

      {/* APPLICANT TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verifikasi Formulir PPDB Online</h3>
            <p className="text-xs text-slate-500">Kelola dan ubah status verifikasi calon peserta didik baru.</p>
          </div>
          <button onClick={() => setToast({ message: 'Fitur unduh CSV belum tersedia', type: 'error' })} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all">
            <span className="material-symbols-outlined text-[17px]">download</span> Unduh Rekap (CSV)
          </button>
        </div>

        {applicants.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <span className="material-symbols-outlined text-4xl text-slate-300">how_to_reg</span>
            <p className="text-sm font-semibold text-slate-500 mt-2">Belum ada pendaftar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Calon Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Jalur</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{a.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{a.nisn}</td>
                    <td className="py-3.5 px-4 text-slate-600">{a.originSchool}</td>
                    <td className="py-3.5 px-4">{getPathwayBadge(a.pathway)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(a.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <select 
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        disabled={isPending}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg font-semibold bg-white focus:outline-teal-500 cursor-pointer"
                      >
                        <option value="MENUNGGU">Menunggu Verifikasi</option>
                        <option value="TERVERIFIKASI">Berkas Terverifikasi</option>
                        <option value="DITERIMA">Diterima</option>
                        <option value="DITOLAK">Tidak Diterima</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PPDB SETTINGS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Jadwal & Informasi PPDB</h3>
            <p className="text-xs text-slate-500">Tampil di halaman publik PPDB.</p>
          </div>
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
                <div key={field.key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{field.label}</label>
                  <input name={field.key} type="text" defaultValue={initialSettings[field.key] ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={settingsPending} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Info Tambahan</label>
              <textarea name="ppdb_info" rows={3} defaultValue={initialSettings.ppdb_info ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={settingsPending} />
            </div>
            <div className="pt-2">
              <button type="submit" disabled={settingsPending} className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm">
                {settingsPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>

        {/* PPDB STEPS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Langkah Pendaftaran</h3>
              <p className="text-xs text-slate-500">Urutan alur pendaftaran siswa.</p>
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all">
              <span className="material-symbols-outlined text-[17px]">add</span> Tambah Langkah
            </button>
          </div>
          
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">{s.stepOrder}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{s.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-teal-50 transition-colors"><PencilSimple size={14} /></button>
                  <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"><Trash size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white p-6 w-full max-w-md rounded-2xl shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">{editingStep ? 'Edit Langkah' : 'Tambah Langkah'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleStepSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Langkah</label>
                <input name="title" type="text" required defaultValue={editingStep?.title} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea name="description" rows={3} required defaultValue={editingStep?.description} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Urut</label>
                  <input name="stepOrder" type="number" min="1" required defaultValue={editingStep?.stepOrder ?? steps.length + 1} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Icon (Phosphor)</label>
                  <select name="icon" defaultValue={editingStep?.icon ?? 'file-text'} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 bg-white" disabled={isPending}>
                    {['user-plus', 'file-text', 'upload-simple', 'check-circle', 'megaphone', 'check-square'].map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
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
    </div>
  );
}
