'use client';

import { useTransition, useState } from 'react';
import { updateSettings } from '@/actions/staff-settings';
import Toast from '@/components/ui/Toast';

type Props = { settings: Record<string, string> };

export default function AdminPengaturanClient({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        setToast({ message: 'Identitas Sekolah berhasil disimpan', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Informasi Pokok Lembaga</h3>
          <p className="text-xs text-slate-500">Kelola nama resmi, NPSN, akreditasi, dan kontak utama yang tampil pada website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Singkat Sekolah</label>
            <input name="school_name_short" type="text" defaultValue={settings.school_name_short ?? 'SMP Negeri 5 Cibeber'} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap & Legal</label>
            <input name="school_name" type="text" defaultValue={settings.school_name ?? 'Sekolah Menengah Pertama Negeri 5 Cibeber'} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">NPSN</label>
            <input name="school_npsn" type="text" defaultValue={settings.school_npsn ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Akreditasi</label>
            <input name="school_accreditation" type="text" defaultValue={settings.school_accreditation ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Lengkap</label>
            <input name="school_address" type="text" defaultValue={settings.school_address ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Telepon / WhatsApp</label>
            <input name="school_phone" type="text" defaultValue={settings.school_phone ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Resmi</label>
            <input name="school_email" type="email" defaultValue={settings.school_email ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2">
            {isPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Simpan Identitas Sekolah'}
          </button>
        </div>
      </form>
    </div>
  );
}
