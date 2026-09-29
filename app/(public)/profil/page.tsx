import Image from 'next/image';
import { db } from '@/lib/db';
import { Student, TreeStructure } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Sekolah',
  description: 'Profil SMPN 5 Cibeber: visi, misi, sejarah, sambutan kepala sekolah, dan struktur organisasi.',
};

async function getProfilData() {
  const [settings, staff] = await Promise.all([
    db.setting.findMany({
      where: {
        key: {
          in: [
            'school_name', 'school_npsn', 'school_nss', 'school_accreditation',
            'school_vision', 'school_mission', 'school_history',
            'headmaster_name', 'headmaster_nip', 'headmaster_welcome', 'headmaster_image',
          ],
        },
      },
    }),
    db.staff.findMany({ where: { active: true }, orderBy: [{ level: 'asc' }, { order: 'asc' }] }),
  ]);
  return { settings: Object.fromEntries(settings.map((x) => [x.key, x.value])), staff };
}

const levelLabel: Record<number, string> = {
  1: 'Pimpinan',
  2: 'Wakil & Staf',
  3: 'Tenaga Pendidik',
};

export default async function ProfilPage() {
  const { settings, staff } = await getProfilData();

  const staffByLevel = {
    1: staff.filter((s) => s.level === 1),
    2: staff.filter((s) => s.level === 2),
    3: staff.filter((s) => s.level === 3),
  };

  return (
    <div>
      {/* Sambutan */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-1">
              <div className="card p-6 text-center space-y-4">
                {settings.headmaster_image ? (
                  <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto ring-4 ring-[#1e3a8a]/20">
                    <Image src={settings.headmaster_image} alt={settings.headmaster_name ?? ''} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="mx-auto h-24 w-24 rounded-full bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 flex items-center justify-center">
                    <Student size={40} weight="duotone" className="text-[#1e3a8a] dark:text-blue-300" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-zinc-100">{settings.headmaster_name ?? 'Kepala Sekolah'}</p>
                  {settings.headmaster_nip && (
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">NIP: {settings.headmaster_nip}</p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Kepala Sekolah</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-left">
                  <p className="text-xs text-slate-500 dark:text-zinc-400">NPSN: <span className="font-mono font-medium text-slate-700 dark:text-zinc-300">{settings.school_npsn ?? '-'}</span></p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Akreditasi: <span className="font-bold text-[#1e3a8a] dark:text-blue-300">{settings.school_accreditation ?? '-'}</span></p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-blue-300 mb-1">Sambutan Kepala Sekolah</p>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Profil SMPN 5 Cibeber</h1>
              </div>
              {settings.headmaster_welcome && (
                <div className="prose-content text-slate-600 dark:text-zinc-400 text-sm whitespace-pre-line leading-relaxed">
                  {settings.headmaster_welcome}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      {(settings.school_vision || settings.school_mission) && (
        <section className="section-padding bg-[#f8fafc] dark:bg-zinc-900/50">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {settings.school_vision && (
                <div className="card p-6 space-y-3">
                  <h2 className="font-bold text-slate-900 dark:text-zinc-100">Visi Sekolah</h2>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{settings.school_vision}</p>
                </div>
              )}
              {settings.school_mission && (
                <div className="card p-6 space-y-3">
                  <h2 className="font-bold text-slate-900 dark:text-zinc-100">Misi Sekolah</h2>
                  <div className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{settings.school_mission}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sejarah */}
      {settings.school_history && (
        <section className="section-padding">
          <div className="container-site max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-4">Sejarah Sekolah</h2>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm">{settings.school_history}</p>
          </div>
        </section>
      )}

      {/* Struktur Organisasi */}
      {staff.length > 0 && (
        <section className="section-padding bg-[#f8fafc] dark:bg-zinc-900/50">
          <div className="container-site">
            <div className="flex items-center gap-3 mb-8">
              <TreeStructure size={22} className="text-[#1e3a8a] dark:text-blue-300" weight="duotone" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Struktur Kepengurusan</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Tenaga pendidik dan kependidikan SMPN 5 Cibeber</p>
              </div>
            </div>

            {([1, 2, 3] as const).map((level) =>
              staffByLevel[level].length > 0 ? (
                <div key={level} className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                    {levelLabel[level]}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {staffByLevel[level].map((s) => (
                      <div key={s.id} className="card p-4 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 flex items-center justify-center shrink-0 overflow-hidden">
                          {s.imageUrl ? (
                            <Image src={s.imageUrl} alt={s.name} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <Student size={18} className="text-[#1e3a8a] dark:text-blue-300" weight="duotone" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight truncate">{s.name}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-tight">{s.position}</p>
                          {s.education && <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{s.education}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}
    </div>
  );
}
