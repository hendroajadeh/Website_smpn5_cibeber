import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';
import {
  ArrowRight,
  Newspaper,
  Buildings,
  Trophy,
  GraduationCap,
  ChalkboardTeacher,
  FilePdf,
  WhatsappLogo,
  BookOpen,
  Desktop,
  Plant,
  Star,
  FileText,
  MapPin,
  CalendarBlank,
  EnvelopeSimple,
  ArrowUpRight,
  NavigationArrow,
} from '@phosphor-icons/react/dist/ssr';
import HomeFaq from '@/components/ui/HomeFaq';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import AchievementCarousel from '@/components/ui/AchievementCarousel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMPN 5 Cibeber — Pusat Pendidikan Unggul & Berkarakter',
  description:
    'Website resmi SMPN 5 Cibeber Kabupaten Lebak, Provinsi Banten. Sekolah berkarakter, asri, berwawasan lingkungan, dan berprestasi dengan Kurikulum Merdeka.',
};

async function getHomeData() {
  const [settings, latestArticles, facilities, achievements, stats] = await Promise.all([
    db.setting.findMany({
      where: {
        key: {
          in: [
            'school_name',
            'school_npsn',
            'headmaster_name',
            'headmaster_nip',
            'headmaster_welcome',
            'headmaster_image',
            'school_vision',
            'school_accreditation',
            'ppdb_year',
            'ppdb_open_date',
            'ppdb_close_date',
            'school_whatsapp',
            'school_phone',
            'school_address',
          ],
        },
      },
    }),
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
      take: 12,
    }),
    Promise.all([
      db.staff.count({ where: { active: true } }),
      db.article.count({ where: { published: true } }),
      db.achievement.count({ where: { active: true } }),
    ]),
  ]);

  const s = Object.fromEntries(settings.map((x) => [x.key, x.value]));
  return {
    settings: s,
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
    achievementCount,
  } = await getHomeData();

  const ppdbYear = settings.ppdb_year ?? '2025/2026';
  const whatsapp = settings.school_whatsapp ?? '0812-3456-7890';
  const npsn = settings.school_npsn ?? '20217851';
  const accreditation = settings.school_accreditation ?? 'A';
  const schoolName = settings.school_name ?? 'SMP Negeri 5 Cibeber';
  const address = settings.school_address ?? 'Jl. Raya Cibeber, Kec. Cibeber, Kabupaten Lebak, Provinsi Banten';
  const mapsQuery = encodeURIComponent(`${schoolName}, ${address}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="bg-[#F8FAFC] text-[#1E293B]">
      {/* =========================================================
          1. HERO SECTION (SMA 8 YOGYAKARTA PRESTIGE LAYOUT + FOTO SEKOLAH ASLI)
          ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 pt-10 pb-20 lg:pt-14 lg:pb-28">
        {/* Foto Resmi Gedung Kampus SMPN 5 Cibeber (Motor & Objek Depan Dibersihkan) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/gedung-smpn5cibeber.jpg"
            alt="Gedung Utama SMP Negeri 5 Cibeber"
            fill
            priority
            className="object-cover object-[center_22%] scale-102"
            sizes="100vw"
          />
          {/* Lapisan Transparan Halus (Diturunkan agar Foto Gedung Lebih Jelas, Berwarna, & Hidup) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/35 to-[#F8FAFC]/90" />
          <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-[#F8FAFC]/70" />
        </div>

        <div className="container-site relative z-10 text-center">
          {/* Centered Large Official School Logo */}
          <div className="relative w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-52 mx-auto drop-shadow-2xl transition-transform hover:scale-105 duration-300">
            <Image
              src="/assets/logo-smpn5cibeber.png"
              alt="Logo Resmi SMPN 5 Cibeber"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 160px, 220px"
            />
          </div>

          {/* Big Bold Institutional Typography */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E293B] tracking-wider uppercase mt-5 leading-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
            SMP NEGERI 5 CIBEBER
          </h1>

          {/* Golden Script / Italic Subtitle Tagline */}
          <p className="text-base sm:text-xl md:text-2xl font-black text-[#B45309] italic tracking-wide mt-1.5 drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
            The Inspiring School Of Cibeber
          </p>

          {/* Institutional Sub-description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-800 max-w-2xl mx-auto mt-2.5 leading-relaxed font-semibold drop-shadow-[0_1px_6px_rgba(255,255,255,0.95)]">
            Pusat Pendidikan Karakter Unggul, Berprestasi, dan Berbudaya Lingkungan di Kabupaten Lebak, Provinsi Banten
          </p>

          {/* Quick Action CTA Buttons (Tepat di bawah Tagline & Subtitel) */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
            <Link
              href="/ppdb"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#D97706] hover:from-amber-600 hover:to-[#B45309] text-white font-bold text-sm shadow-md shadow-amber-950/20 active:scale-95 transition-all"
            >
              <GraduationCap size={18} weight="fill" />
              <span>Daftar PPDB Online {ppdbYear}</span>
              <ArrowRight size={15} weight="bold" />
            </Link>

            <Link
              href="/ppdb#panduan"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-[#1E5631] font-semibold text-sm border border-slate-200/90 shadow-xs backdrop-blur-xs transition-all active:scale-95"
            >
              <FilePdf size={17} weight="fill" className="text-rose-500" />
              <span>Unduh Panduan PPDB (PDF)</span>
            </Link>

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20SMPN%205%20Cibeber`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/90 hover:bg-white text-emerald-800 font-semibold text-sm border border-emerald-200/90 backdrop-blur-xs transition-all active:scale-95"
            >
              <WhatsappLogo size={17} weight="fill" className="text-emerald-600" />
              <span>Konsultasi Panitia</span>
            </a>
          </div>

          {/* 3 FROSTED GLASS CARDS (DIPOSISIKAN LEBIH KE BAWAH AGAR FASAD GEDUNG SEKOLAH TAMPAK LEGA & JELAS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mt-14 sm:mt-20 lg:mt-24 text-left">
            {/* Card 1: Informasi Sekolah */}
            <Link
              href="/profil"
              className="p-5 sm:p-6 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-md text-[#1E293B] border border-white/90 shadow-xl shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1E5631] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 border border-emerald-100">
                <FileText size={26} weight="regular" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors leading-tight">
                  Informasi Sekolah
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-snug">
                  {schoolName}
                </p>
                <p className="text-xs font-bold text-[#1E5631] mt-3 tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  <span>NPSN: {npsn} &bull; Akreditasi: {accreditation} (Unggul)</span>
                </p>
              </div>
            </Link>

            {/* Card 2: Alamat Sekolah — Klik Langsung Mengarah ke Lokasi Google Maps */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka lokasi & petunjuk arah SMPN 5 Cibeber di Google Maps"
              className="p-5 sm:p-6 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-md text-[#1E293B] border border-white/90 shadow-xl shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 flex items-start gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 border border-amber-100">
                <MapPin size={26} weight="fill" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors leading-tight">
                    Alamat Sekolah
                  </h2>
                  <ArrowUpRight size={15} weight="bold" className="text-slate-400 group-hover:text-[#1E5631] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 line-clamp-2 leading-snug">
                  {address}
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-[#1E5631] group-hover:text-emerald-700">
                  <NavigationArrow size={14} weight="bold" />
                  <span>Buka Peta &amp; Petunjuk Arah</span>
                </div>
              </div>
            </a>

            {/* Card 3: Event / Agenda */}
            <Link
              href="/ppdb"
              className="p-5 sm:p-6 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-md text-[#1E293B] border border-white/90 shadow-xl shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 border border-blue-100">
                <CalendarBlank size={26} weight="regular" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors leading-tight">
                  Agenda : PPDB {ppdbYear}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-snug">
                  Pendaftaran Siswa Baru Jalur Zonasi &amp; Prestasi
                </p>
                <p className="text-xs font-bold text-[#D97706] mt-3 inline-flex items-center gap-1 group-hover:underline">
                  <span>Informasi Jadwal &amp; Persyaratan</span>
                  <ArrowRight size={13} weight="bold" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. FLOATING METRIC COUNTER BAR (REPUTASI SEKOLAH)
          ========================================================= */}
      <section className="relative z-20 -mt-6 sm:-mt-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-5 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="text-center px-2 pt-2 sm:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1E5631] tracking-tight">30+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Tahun Pengabdian</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Mencerdaskan Generasi Bangsa</p>
          </div>

          <div className="text-center px-2 pt-2 sm:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">Akreditasi A</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Predikat Unggul</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Badan Akreditasi Nasional (BAN)</p>
          </div>

          <div className="text-center px-2 pt-4 sm:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1E5631] tracking-tight">{staffCount > 0 ? staffCount : '28'}+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Tenaga Pendidik</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Guru Kompeten &amp; Tersertifikasi</p>
          </div>

          <div className="text-center px-2 pt-4 sm:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">{achievementCount > 0 ? achievementCount : '15'}+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Cabang Bakat &amp; Prestasi</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Akademik, Seni, &amp; Olahraga</p>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. PILAR KEUNGGULAN (MENGAPA MEMILIH SMPN 5 CIBEBER)
          ========================================================= */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.14]" />

        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5631] tracking-tight">
              Mengapa Memilih SMPN 5 Cibeber?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Komitmen kami adalah menghadirkan lingkungan belajar yang menumbuhkan potensi terbaik setiap peserta didik, baik dalam akhlak, intelektual, maupun kepedulian sosial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pilar 1 */}
            <div className="card p-6 sm:p-7 bg-white border border-slate-200/80 hover:border-[#1E5631]/40 transition-all hover:shadow-md group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E5631] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Star size={24} weight="fill" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#1E5631] transition-colors">
                  Karakter &amp; Profil Pelajar Pancasila (P5)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pembiasaan religius pagi, disiplin, toleransi, dan kepemimpinan untuk membentuk pribadi siswa yang santun, tangguh, dan berintegritas.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#1E5631]">
                <span>Pembinaan Berkelanjutan</span>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="card p-6 sm:p-7 bg-white border border-slate-200/80 hover:border-[#1E5631]/40 transition-all hover:shadow-md group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Plant size={24} weight="fill" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#1E5631] transition-colors">
                  Kampus Hijau &amp; Bebas Perundungan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lingkungan belajar terbuka yang asri, sejuk, dan terlindungi dengan kebijakan tegas anti-bullying demi keamanan psikologis siswa.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#D97706]">
                <span>Sekolah Ramah Anak</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="card p-6 sm:p-7 bg-white border border-slate-200/80 hover:border-[#1E5631]/40 transition-all hover:shadow-md group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Desktop size={24} weight="fill" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#1E5631] transition-colors">
                  Fasilitas Digital &amp; Laboratorium
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Didukung Laboratorium Komputer terkoneksi internet cepat, Lab IPA praktikum aktif, dan perpustakaan digital untuk literasi masa kini.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-700">
                <span>Teknologi Pembelajaran</span>
              </div>
            </div>

            {/* Pilar 4 */}
            <div className="card p-6 sm:p-7 bg-white border border-slate-200/80 hover:border-[#1E5631]/40 transition-all hover:shadow-md group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Trophy size={24} weight="fill" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#1E5631] transition-colors">
                  Akselerasi Bakat &amp; Prestasi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bimbingan intensif kompetisi sains (OSN), olahraga (O2SN), seni budaya (FLS2N), serta kepanduan Pramuka Garuda berprestasi.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-rose-600">
                <span>Juara Tingkat Kota &amp; Provinsi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. PESAN DARI KEPALA SEKOLAH & DEWAN GURU (EXECUTIVE DISPATCH)
          ========================================================= */}
      <section className="relative overflow-hidden section-padding border-y border-slate-200/80">
        {/* Background Foto Asli Dewan Guru & Staf SMPN 5 Cibeber */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/dewan-guru-smpn5cibeber.jpg"
            alt="Dewan Guru dan Tenaga Kependidikan SMPN 5 Cibeber"
            fill
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          {/* Lapisan Putih Diturunkan Opasitasnya agar Foto Guru Tampak Jelas & Berwarna */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/60 to-white/75" />
          <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-white/60" />
        </div>

        <div className="container-site relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Foto Kepala Sekolah (4 Cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 ring-1 ring-slate-900/10">
                <Image
                  src={settings.headmaster_image || '/assets/kepala-sekolah.jpg'}
                  alt={settings.headmaster_name || 'Kepala Sekolah SMPN 5 Cibeber'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-base font-extrabold">{settings.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.'}</p>
                  <p className="text-xs text-emerald-200 font-semibold">Kepala Sekolah SMPN 5 Cibeber</p>
                  {settings.headmaster_nip && (
                    <p className="text-[10px] text-emerald-300/80 mt-0.5">NIP. {settings.headmaster_nip}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pesan Kepemimpinan (8 Cols) */}
            <div className="lg:col-span-8 p-6 sm:p-9 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-xl shadow-slate-900/5 space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5631] tracking-tight leading-snug">
                &ldquo;Pendidikan Bermutu Adalah Menumbuhkan Adab, Pikiran Merdeka, dan Karakter Mulia.&rdquo;
              </h2>

              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-medium">
                <p>
                  {settings.headmaster_welcome ||
                    'Selamat datang di portal informasi resmi SMP Negeri 5 Cibeber. Kami meyakini bahwa setiap anak memiliki keunikan dan potensi luar biasa yang siap bertumbuh bila didukung oleh lingkungan sekolah yang kondusif, berakar pada keteladanan budi pekerti, dan berpijak pada kemajuan teknologi.'}
                </p>
                <p>
                  Melalui implementasi Kurikulum Merdeka, seluruh dewan guru berkomitmen membimbing putra-putri kita menjadi generasi pembelajar sepanjang hayat yang unggul dalam prestasi, taat beragama, serta mencintai kelestarian lingkungannya.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E5631] hover:bg-[#164325] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <span>Pelajari Profil &amp; Visi Misi Sekolah</span>
                  <ArrowRight size={15} weight="bold" />
                </Link>

                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200/90 shadow-xs transition-all"
                >
                  <ChalkboardTeacher size={16} weight="bold" />
                  <span>Struktur Dewan Guru &amp; Staf</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. PROGRAM UNGGULAN SEKOLAH (OVERVIEW / LEVEL SHOWCASE)
          ========================================================= */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5631] tracking-tight">
              Program Unggulan SMPN 5 Cibeber
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Program terencana yang dirancang untuk membekali siswa dengan kompetensi abad ke-21.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1E5631] flex items-center justify-center mb-4">
                <BookOpen size={22} weight="bold" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B] mb-2">Pembiasaan Religius &amp; Literasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tadarus Al-Qur&apos;an / doa pagi bersama setiap hari, pembacaan Asmaul Husna, dan program 15 menit membaca senyap di kelas.
              </p>
            </div>

            <div className="card p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Desktop size={22} weight="bold" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B] mb-2">Literasi Digital &amp; Komputer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengenalan dasar komputer, pengetikan terstruktur, pengoperasian aplikasi perkantoran, dan edukasi internet sehat aman.
              </p>
            </div>

            <div className="card p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Plant size={22} weight="bold" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B] mb-2">Gerakan Sekolah Adiwiyata</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengelolaan bank sampah sekolah, pemilahan organik/anorganik, pemeliharaan tanaman hidroponik, dan taman kelas asri.
              </p>
            </div>

            <div className="card p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <GraduationCap size={22} weight="bold" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B] mb-2">Klinik Sukses Masuk SMA/SMK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bimbingan pemetaan minat bakat, persiapan asesmen jenjang, dan konsultasi pemilihan SMA/SMK negeri favorit bagi siswa kelas IX.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* =========================================================
          7. WARTA & AGENDA SEKOLAH TERKINI
          ========================================================= */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5631] tracking-tight">
                Warta &amp; Agenda Sekolah
              </h2>
            </div>
            <Link
              href="/berita"
              className="text-xs sm:text-sm font-bold text-[#D97706] hover:text-[#B45309] inline-flex items-center gap-1 transition-colors"
            >
              <span>Lihat Semua Kabar &amp; Agenda</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/berita/${article.slug}`}
                className="card overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Newspaper size={44} weight="light" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#1E5631]/90 text-white text-[10px] font-bold">
                    {formatDateShort(article.publishedAt ?? article.createdAt)}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1E293B] group-hover:text-[#1E5631] transition-colors line-clamp-2 mb-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E5631]">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={13} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          8. PRESTASI SISWA & PENGHARGAAN (HORIZONTAL SCROLL STREAM)
          ========================================================= */}
      {achievements.length > 0 && (
        <section className="relative overflow-hidden section-padding border-y border-emerald-950/30">
          {/* Background Foto Asli Tim Siswa Marching Band SMPN 5 Cibeber */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/assets/prestasi-siswa-smpn5cibeber.jpg"
              alt="Tim Marching Band dan Siswa Berprestasi SMPN 5 Cibeber"
              fill
              className="object-cover object-[center_40%]"
              sizes="100vw"
            />
            {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Siswa Terlihat Nyata & Berwarna (Tanpa Siluet Batik) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/78 via-[#1E5631]/65 to-[#143e22]/88" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
          </div>

          <div className="container-site relative z-10">
            <AchievementCarousel achievements={achievements} />
          </div>
        </section>
      )}

      {/* =========================================================
          9. FASILITAS KAMPUS LENGKAP
          ========================================================= */}
      {facilities.length > 0 && (
        <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
          {/* Siluet Batik Mega Mendung */}
          <MegaMendungPattern opacity="opacity-[0.13]" />

          <div className="container-site relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5631] tracking-tight">
                  Fasilitas Penunjang Pembelajaran
                </h2>
              </div>
              <Link
                href="/fasilitas"
                className="text-xs sm:text-sm font-bold text-[#D97706] hover:text-[#B45309] inline-flex items-center gap-1 transition-colors"
              >
                <span>Jelajahi Semua Fasilitas</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="card overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    {facility.imageUrl ? (
                      <Image
                        src={facility.imageUrl}
                        alt={facility.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Buildings size={40} weight="light" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#1E293B] group-hover:text-[#1E5631] transition-colors">
                      {facility.name}
                    </h3>
                    {facility.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {facility.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          10. FAQ (PERTANYAAN YANG SERING DIAJUKAN)
          ========================================================= */}
      <HomeFaq />

      {/* =========================================================
          11. PRE-FOOTER CALL TO ACTION
          ========================================================= */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-[#1E5631] via-[#1b4e2c] to-[#143e22] text-white relative overflow-hidden">
        {/* Siluet Batik Mega Mendung Warna Putih Khas Jawa Barat */}
        <MegaMendungPattern variant="white" opacity="opacity-[0.20]" />

        <div className="container-site relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            Siap Bergabung dengan Keluarga Besar SMPN 5 Cibeber?
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
            Wujudkan masa depan gemilang putra-putri Anda bersama ekosistem pendidikan yang berkarakter, asri, dan berprestasi.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/ppdb"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#D97706] hover:from-amber-600 hover:to-[#B45309] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/40 active:scale-95 transition-all duration-200"
            >
              <span>Daftar PPDB Online Sekarang</span>
              <ArrowRight size={17} weight="bold" />
            </Link>

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SMPN%205%20Cibeber`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/30 backdrop-blur-xs active:scale-95 transition-all duration-200"
            >
              <WhatsappLogo size={18} weight="fill" className="text-emerald-300" />
              <span>Hubungi Panitia via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
