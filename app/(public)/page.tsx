import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMPN 5 Cibeber — Website Resmi Sekolah',
  description:
    'Website resmi SMPN 5 Cibeber. Informasi berita, profil, fasilitas, galeri, dan PPDB.',
};

async function getHomeData() {
  const [settingsList, latestArticles, facilities, achievements, stats] = await Promise.all([
    db.setting.findMany(),
    db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    db.facility.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
    db.achievement.findMany({
      where: { active: true },
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
      take: 4,
    }),
    Promise.all([
      db.staff.count({ where: { active: true } }),
      db.article.count({ where: { published: true } }),
      db.achievement.count({ where: { active: true } }),
    ]),
  ]);

  const settings = Object.fromEntries(settingsList.map((x) => [x.key, x.value]));
  return {
    settings,
    latestArticles,
    facilities,
    achievements,
    staffCount: stats[0],
    articleCount: stats[1],
    achievementCount: stats[2],
  };
}

export default async function HomePage() {
  const {
    settings,
    latestArticles,
    facilities,
    achievements,
    staffCount,
    articleCount,
    achievementCount,
  } = await getHomeData();

  // Dynamic Ticker Announcements
  const tickerItems = [
    settings.ticker_text_1 || '📢 Pendaftaran PPDB 2025/2026 Jalur Zonasi & Prestasi Resmi Dibuka.',
    settings.ticker_text_2 || '📅 Ujian Asesmen Sumatif Akhir Jenjang Kelas IX dimulai 12 Mei 2025.',
    settings.ticker_text_3 || '🏆 Selamat atas Juara 1 Lomba OSN IPA Tingkat Kabupaten diraih siswa SMPN 5 Cibeber!',
  ].filter(Boolean);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="relative w-full rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex items-center shadow-lg bg-primary">
          {settings.hero_image && (
            <Image
              src={settings.hero_image}
              alt="Hero Image SMPN 5 Cibeber"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-primary/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>

          <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-3xl flex flex-col gap-4 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed border border-secondary-fixed/30 text-xs font-bold w-fit">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>
                {settings.hero_badge ||
                  `Terakreditasi ${settings.school_accreditation || 'A'} (Unggul) • NPSN ${settings.school_npsn || '20217851'}`}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {settings.hero_title || 'Mendidik Insan Unggul, Berkarakter & Adaptif Era Digital'}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              {settings.hero_subtitle ||
                'Selamat datang di Portal Resmi SMP Negeri 5 Cibeber. Berkomitmen menghadirkan ekosistem pembelajaran Kurikulum Merdeka yang ramah anak, berakar pada kearifan lokal, dan berwawasan global.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={settings.hero_cta_link || '/ppdb'}
                className="px-5 py-3 rounded-xl bg-secondary text-white font-bold text-sm shadow-md hover:bg-opacity-90 flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span>
                  {settings.hero_cta_text || `Daftar PPDB Online ${settings.ppdb_year || '2025/2026'}`}
                </span>
              </Link>
              <Link
                href={settings.hero_secondary_link || '/profil'}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2 border border-white/20"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>{settings.hero_secondary_text || 'Pelajari Profil Sekolah'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ticker Pengumuman Berjalan (Marquee) */}
        <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-3 overflow-hidden shadow-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-white text-[11px] font-bold uppercase tracking-wider shrink-0">
            <span className="material-symbols-outlined text-[14px]">campaign</span> Pengumuman
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee flex items-center gap-8 text-xs font-medium text-primary">
              {tickerItems.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHORTCUT QUICK MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          <Link
            href="/ppdb"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <span className="text-xs font-bold text-primary">PPDB Online</span>
            <span className="text-[10px] text-on-surface-variant">T.A {settings.ppdb_year || '2025/2026'}</span>
          </Link>

          <Link
            href="/profil"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
            <span className="text-xs font-bold text-primary">Kurikulum</span>
            <span className="text-[10px] text-on-surface-variant">Merdeka</span>
          </Link>

          <Link
            href="/berita"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <span className="text-xs font-bold text-primary">Kalender</span>
            <span className="text-[10px] text-on-surface-variant">Agenda</span>
          </Link>

          <Link
            href="/profil"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <span className="text-xs font-bold text-primary">Dewan Guru</span>
            <span className="text-[10px] text-on-surface-variant">Pendidik</span>
          </Link>

          <a
            href="https://belajar.id"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">local_library</span>
            </div>
            <span className="text-xs font-bold text-primary">E-Library</span>
            <span className="text-[10px] text-on-surface-variant">Belajar.id</span>
          </a>

          <a
            href="https://raporpendidikan.kemdikbud.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <span className="text-xs font-bold text-primary">Rapor Mutu</span>
            <span className="text-[10px] text-on-surface-variant">Kemdikbud</span>
          </a>

          <a
            href="https://siplah.kemdikbud.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <span className="text-xs font-bold text-primary">SIPLah</span>
            <span className="text-[10px] text-on-surface-variant">Pengadaan</span>
          </a>

          <Link
            href="/kontak"
            className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container/60 flex flex-col items-center text-center shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
            </div>
            <span className="text-xs font-bold text-primary">Kontak</span>
            <span className="text-[10px] text-on-surface-variant">Peta Lokasi</span>
          </Link>
        </div>
      </section>

      {/* SAMBUTAN KEPALA SEKOLAH & VISI MISI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container/60">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center">
              {settings.headmaster_image ? (
                <Image
                  src={settings.headmaster_image}
                  alt={settings.headmaster_name || 'Kepala Sekolah'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <span className="material-symbols-outlined text-[64px] text-primary">person</span>
              )}
              <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-xl shadow-xs border border-surface-container/40">
                <p className="text-sm font-bold text-primary">{settings.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.'}</p>
                <p className="text-xs text-secondary font-semibold">
                  {settings.headmaster_title || 'Kepala Sekolah SMPN 5 Cibeber'}
                </p>
                {settings.headmaster_nip && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">NIP: {settings.headmaster_nip}</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container/60 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[26px]">format_quote</span>
                <h2 className="text-xl sm:text-2xl text-primary font-bold">Sambutan Hangat Kepala Sekolah</h2>
              </div>
              <div className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                {settings.headmaster_welcome ||
                  'Selamat datang di website resmi SMP Negeri 5 Cibeber. Semoga media ini menjadi sarana komunikasi, publikasi kegiatan, dan informasi yang bermanfaat bagi civitas akademika dan masyarakat luas.'}
              </div>
            </div>

            {/* Visi & Misi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-primary-container text-on-primary shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-secondary-fixed uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[18px]">visibility</span> Visi Sekolah
                  </span>
                  <p className="text-sm sm:text-base font-bold text-secondary-fixed leading-snug">
                    {settings.school_vision ||
                      'Mewujudkan Peserta Didik yang Religius, Berkarakter Unggul, Cerdas Berprestasi, dan Berbudaya Lingkungan.'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[18px]">flag</span> Misi Utama
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4 whitespace-pre-line">
                    {settings.school_mission ||
                      '1. Menumbuhkan penghayatan dan pengamalan ajaran agama.\n2. Melaksanakan pembelajaran efektif dan menyenangkan.\n3. Menumbuhkan semangat berprestasi kepada seluruh warga sekolah.'}
                  </p>
                </div>
                <Link href="/profil" className="text-xs font-bold text-secondary hover:underline mt-2 inline-flex items-center gap-1">
                  <span>Lihat Seluruh Misi</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-primary text-on-primary shadow-sm flex flex-col justify-between">
            <span className="text-xs text-secondary-fixed font-bold uppercase tracking-wider">Total Siswa</span>
            <span className="text-4xl font-extrabold my-2">{settings.stat_students || '480'}+</span>
            <span className="text-xs text-gray-300">Siswa Aktif Dapodik</span>
          </div>

          <div className="p-6 rounded-2xl bg-secondary text-on-secondary shadow-sm flex flex-col justify-between">
            <span className="text-xs text-secondary-fixed font-bold uppercase tracking-wider">Pendidik &amp; Tenaga</span>
            <span className="text-4xl font-extrabold my-2">{settings.stat_teachers || staffCount}+</span>
            <span className="text-xs text-gray-200">Guru &amp; Tenaga Kependidikan</span>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col justify-between">
            <span className="text-xs text-secondary font-bold uppercase tracking-wider">Prestasi Siswa</span>
            <span className="text-4xl font-extrabold text-primary my-2">{achievementCount}+</span>
            <span className="text-xs text-on-surface-variant">Penghargaan Diraih</span>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col justify-between">
            <span className="text-xs text-secondary font-bold uppercase tracking-wider">Status Akreditasi</span>
            <span className="text-4xl font-extrabold text-primary my-2">{settings.school_accreditation || 'A'}</span>
            <span className="text-xs text-on-surface-variant">Predikat Unggul Nasional</span>
          </div>
        </div>
      </section>

      {/* WARTA & PENGUMUMAN TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl sm:text-2xl text-primary font-bold flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-secondary"></span> Warta &amp; Pengumuman Terbaru
            </h2>
            <Link href="/berita" className="text-sm font-bold text-secondary hover:underline">
              Lihat Semua Berita
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/berita/${article.slug}`}
                className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
              >
                <div className="flex-1">
                  <span className="text-xs font-bold text-secondary block mb-1">
                    {formatDateShort(article.publishedAt ?? article.createdAt)}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTASI SISWA */}
      {achievements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">Prestasi Sekolah</span>
              <h2 className="text-2xl text-primary font-bold mt-1">Prestasi Membanggakan Peserta Didik</h2>
            </div>
            <Link href="/prestasi" className="text-sm font-bold text-secondary hover:underline">
              Lihat Semua Prestasi
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="w-full h-44 bg-surface-container flex items-center justify-center relative">
                  {ach.imageUrl ? (
                    <Image src={ach.imageUrl} alt={ach.title} fill className="object-cover" sizes="300px" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px] text-primary/40">emoji_events</span>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold">
                    Tahun {ach.year}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary uppercase">
                      Tingkat {ach.level}
                    </span>
                    <h3 className="font-bold text-primary text-sm mt-2 line-clamp-2">{ach.title}</h3>
                    {ach.description && (
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{ach.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FASILITAS SEKOLAH */}
      {facilities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest text-secondary font-bold">Sarana Pembelajaran</span>
            <h2 className="text-2xl sm:text-3xl text-primary font-bold mt-1">Fasilitas Lengkap Penunjang Belajar</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-hidden flex flex-col"
              >
                <div className="w-full h-44 bg-surface-container flex items-center justify-center relative">
                  {facility.imageUrl ? (
                    <Image src={facility.imageUrl} alt={facility.name} fill className="object-cover" sizes="300px" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px] text-primary">domain</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-primary text-sm">{facility.name}</h3>
                  {facility.description && (
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{facility.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KONTAK & PETA LOKASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">Aksesibilitas Kampus</span>
              <h2 className="text-2xl text-primary font-bold mt-1">Lokasi Strategis &amp; Peta Sekolah</h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                {settings.school_address || 'Jl. Raya Cibeber No.5, Cibeber, Kec. Cibeber, Kabupaten Cianjur, Jawa Barat 43261'}
              </p>
            </div>
            <Link
              href="/kontak"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span> Detail &amp; Peta Lokasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
