import Image from 'next/image';
import { db } from '@/lib/db';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import {
  Student,
  TreeStructure,
  Target,
  Compass,
  HourglassHigh,
  ChalkboardTeacher,
  ShieldCheck,
} from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Sekolah, Visi, Misi & Dewan Guru',
  description:
    'Profil lengkap SMPN 5 Cibeber: visi, misi, sejarah pendirian, sambutan kepala sekolah, serta direktori dewan guru dan tenaga kependidikan.',
};

async function getProfilData() {
  const [settings, staff] = await Promise.all([
    db.setting.findMany({
      where: {
        key: {
          in: [
            'school_name',
            'school_npsn',
            'school_nss',
            'school_accreditation',
            'school_vision',
            'school_mission',
            'school_history',
            'headmaster_name',
            'headmaster_nip',
            'headmaster_welcome',
            'headmaster_image',
          ],
        },
      },
    }),
    db.staff.findMany({
      where: { active: true },
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
    }),
  ]);
  return { settings: Object.fromEntries(settings.map((x) => [x.key, x.value])), staff };
}

const levelLabel: Record<number, string> = {
  1: 'Pimpinan Sekolah',
  2: 'Wakil Kepala & Staf Tata Usaha',
  3: 'Dewan Guru / Tenaga Pendidik',
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
      {/* Hero Banner Profil — Background Foto Lapangan & Panggung Sekolah dengan Tint Hijau Lembut */}
      <section className="relative overflow-hidden text-white py-16 md:py-22 border-b border-emerald-950/20">
        {/* Background Foto Asli Lapangan & Panggung SMPN 5 Cibeber */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/lapangan-smpn5cibeber.jpg"
            alt="Lapangan Upacara dan Panggung SMPN 5 Cibeber"
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Lapangan Terlihat Jelas & Hidup */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/68 via-[#1E5631]/58 to-[#143e22]/82" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/25 to-emerald-950/50" />
        </div>

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <ShieldCheck size={16} weight="fill" />
            <span>Profil Resmi Lembaga</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Profil SMPN 5 Cibeber
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto font-medium drop-shadow-sm leading-relaxed">
            Mengenal lebih dekat sejarah, visi misi, arah pendidikan, serta jajaran pendidik berdedikasi di SMPN 5 Cibeber, Kabupaten Lebak, Provinsi Banten.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 font-mono text-white font-semibold shadow-xs">
              NPSN: {settings.school_npsn ?? '20217851'}
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/25 backdrop-blur-md text-white border border-white/35 font-bold shadow-xs">
              Akreditasi: {settings.school_accreditation ?? 'A'} Unggul
            </span>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="relative overflow-hidden section-padding bg-white border-b border-slate-200">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.14]" />

        <div className="container-site max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Foto & Info Kepala Sekolah — Seperti di Beranda */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 ring-1 ring-slate-900/10 group">
                <Image
                  src={settings.headmaster_image || '/assets/kepala-sekolah.jpg'}
                  alt={settings.headmaster_name || 'Kepala Sekolah SMPN 5 Cibeber'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600/80 text-[10px] font-bold tracking-wide uppercase mb-1.5 border border-emerald-400/30">
                    Kepala Sekolah
                  </span>
                  <p className="text-base sm:text-lg font-extrabold leading-tight">
                    {settings.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.'}
                  </p>
                  <p className="text-xs text-emerald-200 font-semibold mt-0.5">
                    Kepala SMPN 5 Cibeber
                  </p>
                  {settings.headmaster_nip && (
                    <p className="text-[10px] text-emerald-300/85 mt-1 font-mono">
                      NIP: {settings.headmaster_nip}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Teks Sambutan Lengkap */}
            <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xs border border-slate-200/80 shadow-md shadow-slate-900/5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1E5631] mb-1">
                  Pesan &amp; Sambutan
                </p>
                {/* Judul Utama — Academic Green (#1E5631) */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
                  Membangun Karakter Melalui Pendidikan Bermutu
                </h2>
              </div>

              {settings.headmaster_welcome ? (
                /* Teks Utama — Dark Charcoal (#1E293B) */
                <div className="text-sm sm:text-base text-[#1E293B]/85 leading-relaxed space-y-3 whitespace-pre-line">
                  {settings.headmaster_welcome}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Sambutan belum diisi.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      {(settings.school_vision || settings.school_mission) && (
        <section className="relative overflow-hidden section-padding border-b border-emerald-950/20">
          {/* Background Foto Asli Gedung Sekolah SMPN 5 Cibeber */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/assets/gedung-smpn5cibeber.jpg"
              alt="Gedung SMP Negeri 5 Cibeber"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Lapisan Hijau Diturunkan Opasitas / Saturasinya agar Foto Gedung Terlihat Jelas & Hidup */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/78 via-[#1E5631]/65 to-[#143e22]/88" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
          </div>

          <div className="container-site max-w-5xl mx-auto relative z-10">
            <div className="text-center space-y-2 mb-10">
              {/* Judul Utama */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                Visi &amp; Misi Sekolah
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium drop-shadow-sm">
                Landasan dan arah perjuangan penyelenggaraan pendidikan di SMPN 5 Cibeber
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Visi (5 cols) — Frosted Glass Container */}
              {settings.school_vision && (
                <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xl shadow-emerald-950/20 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-[#eaf4ed] text-[#1E5631] flex items-center justify-center">
                      <Target size={22} weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E293B]">
                      Visi Sekolah
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-[#1E293B] leading-relaxed italic border-l-4 border-[#1E5631] pl-3.5">
                      &ldquo;{settings.school_vision}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Misi (7 cols) — Frosted Glass Container */}
              {settings.school_mission && (
                <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xl shadow-emerald-950/20 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-[#eaf4ed] text-[#1E5631] flex items-center justify-center">
                    <Compass size={22} weight="duotone" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B]">
                    Misi Sekolah
                  </h3>
                  <div className="text-xs sm:text-sm text-[#1E293B]/85 leading-relaxed whitespace-pre-line font-medium">
                    {settings.school_mission}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sejarah Sekolah */}
      {settings.school_history && (
        <section className="relative overflow-hidden section-padding bg-white border-b border-slate-200">
          {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
          <MegaMendungPattern opacity="opacity-[0.13]" />

          <div className="container-site max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="flex items-center gap-2.5 text-[#1E5631]">
              <HourglassHigh size={24} weight="duotone" />
              {/* Judul Utama — Academic Green (#1E5631) */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E5631]">
                Sejarah Singkat Pendirian
              </h2>
            </div>
            <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FAFC]/90 backdrop-blur-xs border border-slate-200 text-xs sm:text-sm text-[#1E293B]/85 leading-relaxed">
              {settings.school_history}
            </div>
          </div>
        </section>
      )}

      {/* Struktur Kepengurusan & Dewan Guru */}
      {staff.length > 0 && (
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-site">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl bg-[#1E5631] text-white flex items-center justify-center shadow-xs">
                <TreeStructure size={22} weight="bold" />
              </div>
              <div>
                {/* Judul Utama — Academic Green (#1E5631) */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
                  Dewan Guru & Tenaga Kependidikan
                </h2>
                <p className="text-xs sm:text-sm text-[#1E293B]/70">
                  Pendidik profesional yang siap membimbing dan menginspirasi siswa
                </p>
              </div>
            </div>

            {([1, 2, 3] as const).map((level) =>
              staffByLevel[level].length > 0 ? (
                <div key={level} className="mb-10 last:mb-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-200">
                    {levelLabel[level]}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {staffByLevel[level].map((s) => (
                      <div
                        key={s.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="h-12 w-12 rounded-xl bg-[#eaf4ed] border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {s.imageUrl ? (
                            <Image
                              src={s.imageUrl}
                              alt={s.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Student size={22} className="text-[#1E5631]" weight="duotone" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#1E293B] truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-[#1E5631] font-medium truncate mt-0.5">
                            {s.position}
                          </p>
                          {s.education && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                              {s.education}
                            </p>
                          )}
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
