'use client';

import { useTransition, useState } from 'react';
import { updateSettings } from '@/actions/staff-settings';
import Toast from '@/components/ui/Toast';

type Props = { settings: Record<string, string> };

export default function AdminProfilClient({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        setToast({ message: 'Profil & Sambutan disimpan', type: 'success' });
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
          <h3 className="text-base font-bold text-slate-900">Profil Pimpinan & Visi Misi</h3>
          <p className="text-xs text-slate-500">Ubah sambutan kepala sekolah, foto pimpinan, serta butir visi & misi sekolah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kepala Sekolah & Gelar</label>
            <input name="headmaster_name" type="text" defaultValue={settings.headmaster_name ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">NIP Kepala Sekolah</label>
            <input name="headmaster_nip" type="text" defaultValue={settings.headmaster_nip ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Visi Sekolah</label>
            <textarea name="school_vision" rows={2} defaultValue={settings.school_vision ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Misi Sekolah</label>
            <textarea name="school_mission" rows={4} defaultValue={settings.school_mission ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Sambutan Singkat Kepala Sekolah</label>
            <textarea name="headmaster_welcome" rows={4} defaultValue={settings.headmaster_welcome ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Sejarah Sekolah</label>
            <textarea name="school_history" rows={3} defaultValue={settings.school_history ?? ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
          </div>
          
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Kepala Sekolah (Opsional)</label>
            <input name="headmaster_image" type="file" accept="image/*" className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
            {settings.headmaster_image && <p className="text-[10px] text-teal-600 mt-1 font-bold">Foto saat ini sudah tersimpan.</p>}
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Gambar Hero Halaman Utama (Opsional)</label>
            <input name="hero_image" type="file" accept="image/*" className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500" disabled={isPending} />
            {settings.hero_image && <p className="text-[10px] text-teal-600 mt-1 font-bold">Gambar saat ini sudah tersimpan.</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2">
            {isPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Perbarui Profil & Sambutan'}
          </button>
        </div>
      </form>
    </div>
  );
}
