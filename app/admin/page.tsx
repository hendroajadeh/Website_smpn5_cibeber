import { db } from '@/lib/db';
import Link from 'next/link';
import QuickAddPrestasi from '@/components/admin/QuickAddPrestasi';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Ikhtisar' };

async function getDashboardStats() {
  const [articles, staff, applicants, achievements, facilities, settings] = await Promise.all([
    db.article.count(),
    db.staff.count(),
    db.ppdbApplicant.count(),
    db.achievement.count(),
    db.facility.count(),
    db.setting.findMany({
      where: {
        key: {
          in: ['stat_students', 'school_name', 'hero_title', 'school_accreditation'],
        },
      },
    }),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return { articles, staff, applicants, achievements, facilities, settings: settingsMap };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Siswa Aktif</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.settings.stat_students || '480'}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> Terdaftar di Dapodik
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guru &amp; Staf</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.staff}</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Total Pendidik &amp; Staf</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prestasi Siswa</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.achievements}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">emoji_events</span> Penghargaan Terdata
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">trophy</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Artikel Berita</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.articles}</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Total Publikasi Aktif</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">article</span>
          </div>
        </div>
      </div>

      {/* QUICK PRESTASI SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900">Pembaruan Cepat Prestasi</h4>
          <p className="text-xs text-slate-500 max-w-xl">
            Punya kabar baik dari siswa hari ini? Tambahkan data prestasi beserta fotonya secara langsung dari dashboard.
          </p>
        </div>
        <QuickAddPrestasi />
      </div>

      {/* QUICK HOMEPAGE CUSTOMIZATION CARD */}
      <div className="bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-xs">tune</span>
            <span>Konfigurasi Halaman Depan</span>
          </div>
          <h4 className="text-lg font-bold">Kustomisasi Tampilan Beranda Website Utama</h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            Kelola judul banner, teks pengumuman berjalan (ticker marquee), foto hero, sambutan pimpinan, dan statistik utama agar website selalu relevan dan up-to-date.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/beranda"
            className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Kelola Beranda</span>
          </Link>
          <a
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>Pratinjau Web</span>
          </a>
        </div>
      </div>

      {/* PPDB Alert Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
            Pendaftaran PPDB ({stats.applicants} Pendaftar)
          </span>
          <h4 className="text-base font-bold text-slate-900">Verifikasi Berkas &amp; Formulir Calon Peserta Didik Baru</h4>
          <p className="text-xs text-slate-500 max-w-xl">
            Tinjau NISN, jalur seleksi, kelengkapan berkas pendaftar baru dan tentukan status verifikasi secara real-time.
          </p>
        </div>
        <Link
          href="/admin/ppdb"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          Buka Panel PPDB
        </Link>
      </div>

      {/* Quick Links Matrix in Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/berita"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">newspaper</span>
          </div>
          <h5 className="font-bold text-sm text-slate-900">Kelola Warta &amp; Berita</h5>
          <p className="text-xs text-slate-500 mt-1">Tulis dan terbitkan warta sekolah, agenda kegiatan, dan siaran pers.</p>
        </Link>

        <Link
          href="/admin/prestasi"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">emoji_events</span>
          </div>
          <h5 className="font-bold text-sm text-slate-900">Kelola Prestasi Siswa</h5>
          <p className="text-xs text-slate-500 mt-1">Catat juara lomba tingkat sekolah, kabupaten, hingga nasional.</p>
        </Link>

        <Link
          href="/admin/fasilitas"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">apartment</span>
          </div>
          <h5 className="font-bold text-sm text-slate-900">Kelola Fasilitas</h5>
          <p className="text-xs text-slate-500 mt-1">Perbarui sarana prasarana penunjang pembelajaran di sekolah.</p>
        </Link>
      </div>
    </div>
  );
}
