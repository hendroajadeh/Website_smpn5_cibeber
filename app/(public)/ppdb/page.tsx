import { db } from '@/lib/db';
import {
  UserPlus,
  FileText,
  UploadSimple,
  CheckCircle,
  Megaphone,
  CheckSquare,
} from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPDB',
  description: 'Informasi Penerimaan Peserta Didik Baru (PPDB) SMPN 5 Cibeber.',
};

const iconMap: Record<string, React.ElementType> = {
  'user-plus': UserPlus,
  'file-text': FileText,
  'upload-simple': UploadSimple,
  'check-circle': CheckCircle,
  megaphone: Megaphone,
  'check-square': CheckSquare,
};

async function getPpdbData() {
  const [steps, settings] = await Promise.all([
    db.ppdbStep.findMany({ where: { active: true }, orderBy: { stepOrder: 'asc' } }),
    db.setting.findMany({
      where: { key: { in: ['ppdb_year', 'ppdb_quota', 'ppdb_open_date', 'ppdb_close_date', 'ppdb_announcement_date', 'ppdb_registration_date', 'ppdb_info'] } },
    }),
  ]);
  return { steps, settings: Object.fromEntries(settings.map((x) => [x.key, x.value])) };
}

export default async function PpdbPage() {
  const { steps, settings } = await getPpdbData();

  return (
    <div>
      {/* Header */}
      <section className="bg-[#1e3a8a] py-14">
        <div className="container-site text-center space-y-3">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
            Tahun Ajaran {settings.ppdb_year ?? '2025/2026'}
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Penerimaan Peserta Didik Baru
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm">
            SMPN 5 Cibeber membuka pendaftaran siswa baru untuk tahun ajaran{' '}
            {settings.ppdb_year ?? '2025/2026'}.
          </p>
        </div>
      </section>

      {/* Info jadwal */}
      <section className="section-padding bg-[#f8fafc] dark:bg-zinc-900/50">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Kuota Siswa Baru', value: settings.ppdb_quota ? `${settings.ppdb_quota} Siswa` : '-' },
              { label: 'Pendaftaran Dibuka', value: settings.ppdb_open_date ?? '-' },
              { label: 'Pendaftaran Ditutup', value: settings.ppdb_close_date ?? '-' },
              { label: 'Pengumuman Seleksi', value: settings.ppdb_announcement_date ?? '-' },
              { label: 'Daftar Ulang', value: settings.ppdb_registration_date ?? '-' },
            ].map((item) => (
              <div key={item.label} className="card p-4 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">{item.label}</p>
                <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {settings.ppdb_info && (
            <div className="card p-5 border-l-4 border-[#1e3a8a]">
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{settings.ppdb_info}</p>
            </div>
          )}
        </div>
      </section>

      {/* Alur PPDB */}
      {steps.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Alur Pendaftaran</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-10">Ikuti langkah-langkah berikut untuk mendaftar di SMPN 5 Cibeber</p>

            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-zinc-700 hidden md:block" />

              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const IconComponent = iconMap[step.icon] ?? FileText;
                  return (
                    <div key={step.id} className="relative flex items-start gap-5">
                      <div className="relative z-10 h-12 w-12 rounded-full bg-[#1e3a8a] flex items-center justify-center shrink-0 text-white shadow-md">
                        <IconComponent size={20} weight="bold" />
                      </div>
                      <div className="card p-5 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge badge-brand">Langkah {step.stepOrder}</span>
                          <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{step.title}</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
