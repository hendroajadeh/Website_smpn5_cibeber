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
        setToast({ message: 'Pengaturan berhasil disimpan', type: 'success' });
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-1">Informasi umum sekolah yang tampil di seluruh website</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="label">Nama Sekolah</label>
              <input name="school_name" type="text" defaultValue={settings.school_name ?? ''} className="input" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">Akreditasi</label>
              <select name="school_accreditation" defaultValue={settings.school_accreditation ?? 'A'} className="input" disabled={isPending}>
                {['A', 'B', 'C'].map(v => <option key={v} value={v}>Akreditasi {v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">NPSN</label>
              <input name="school_npsn" type="text" defaultValue={settings.school_npsn ?? ''} className="input font-mono" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">NSS</label>
              <input name="school_nss" type="text" defaultValue={settings.school_nss ?? ''} className="input font-mono" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">Telepon</label>
              <input name="school_phone" type="text" defaultValue={settings.school_phone ?? ''} className="input" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input name="school_email" type="email" defaultValue={settings.school_email ?? ''} className="input" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">WhatsApp (angka saja)</label>
              <input name="school_whatsapp" type="text" defaultValue={settings.school_whatsapp ?? ''} className="input font-mono" placeholder="6281234567890" disabled={isPending} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Alamat Sekolah</label>
            <textarea name="school_address" rows={2} defaultValue={settings.school_address ?? ''} className="input" disabled={isPending} />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
