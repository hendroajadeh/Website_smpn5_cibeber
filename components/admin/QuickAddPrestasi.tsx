'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from '@phosphor-icons/react';
import { createAchievement } from '@/actions/content';
import Toast from '@/components/ui/Toast';

const LEVELS = ['SEKOLAH', 'KECAMATAN', 'KOTA', 'PROVINSI', 'NASIONAL', 'INTERNASIONAL'];
const LEVEL_LABELS: Record<string, string> = { SEKOLAH: 'Sekolah', KECAMATAN: 'Kecamatan', KOTA: 'Kab/Kota', PROVINSI: 'Provinsi', NASIONAL: 'Nasional', INTERNASIONAL: 'Internasional' };

export default function QuickAddPrestasi() {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('active', 'true');
    startTransition(async () => {
      const result = await createAchievement(formData);
      if (result.success) {
        setToast({ message: 'Prestasi berhasil ditambahkan', type: 'success' });
        setShowForm(false);
        // Reload to update dashboard stats
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <button 
        onClick={() => setShowForm(true)} 
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
      >
        <Plus size={16} weight="bold" />
        Tambah Prestasi Baru
      </button>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isPending && setShowForm(false)} />
          <div className="relative card p-6 w-full max-w-md shadow-lg space-y-4 max-h-[90dvh] overflow-y-auto bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Tambah Prestasi Cepat</h2>
              <button onClick={() => !isPending && setShowForm(false)} className="btn btn-ghost btn-sm"><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="form-group">
                <label className="label label-required text-slate-700">Judul Prestasi</label>
                <input name="title" type="text" required className="input" disabled={isPending} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label label-required text-slate-700">Tingkat</label>
                  <select name="level" defaultValue="KOTA" className="input" disabled={isPending}>
                    {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label label-required text-slate-700">Tahun</label>
                  <input name="year" type="number" min="2000" max="2100" required defaultValue={new Date().getFullYear()} className="input" disabled={isPending} />
                </div>
              </div>
              <div className="form-group">
                <label className="label text-slate-700">Foto Prestasi (Opsional)</label>
                <input name="image" type="file" accept="image/*" className="input text-xs" disabled={isPending} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={isPending} className="btn btn-secondary flex-1">Batal</button>
                <button type="submit" disabled={isPending} className="btn btn-primary flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 border-amber-500">
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
