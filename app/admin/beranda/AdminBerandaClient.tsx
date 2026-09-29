'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateSettings } from '@/actions/staff-settings';
import Toast from '@/components/ui/Toast';

type Props = {
  settings: Record<string, string>;
};

export default function AdminBerandaClient({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<'hero' | 'ticker' | 'stats' | 'kepsek'>('hero');
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Live preview states for Hero Banner
  const [heroTitle, setHeroTitle] = useState(
    settings.hero_title || 'Mendidik Insan Unggul, Berkarakter & Adaptif Era Digital'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    settings.hero_subtitle ||
      'Selamat datang di Portal Resmi SMP Negeri 5 Cibeber. Berkomitmen menghadirkan ekosistem pembelajaran Kurikulum Merdeka yang ramah anak, berakar pada kearifan lokal, dan berwawasan global.'
  );
  const [heroBadge, setHeroBadge] = useState(
    settings.hero_badge || `Terakreditasi ${settings.school_accreditation || 'A'} (Unggul) • NPSN ${settings.school_npsn || '20217851'}`
  );
  const [heroCtaText, setHeroCtaText] = useState(
    settings.hero_cta_text || `Daftar PPDB Online ${settings.ppdb_year || '2025/2026'}`
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        setToast({ message: 'Tampilan Beranda berhasil diperbarui!', type: 'success' });
      } else {
        setToast({ message: result.error || 'Gagal menyimpan perubahan', type: 'error' });
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600 text-2xl">view_quilt</span>
            <h2 className="text-lg font-bold text-slate-900">Konfigurasi Tampilan Halaman Utama</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ubah teks, banner, pengumuman berjalan, dan statistik yang tampil langsung di website depan SMPN 5 Cibeber.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shrink-0 w-fit"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          <span>Lihat Website Utama</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'hero'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">wallpaper</span>
          <span>Hero Banner &amp; Headline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ticker')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'ticker'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">campaign</span>
          <span>Pengumuman Berjalan (Ticker)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'stats'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">analytics</span>
          <span>Statistik Utama (Counters)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kepsek')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'kepsek'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">psychology</span>
          <span>Sambutan &amp; Visi Misi</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: HERO BANNER */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Live Visual Preview */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">preview</span> Live Preview Hero Banner
                </span>
                <span className="text-[10px] text-slate-400">Tampilan sesungguhnya di website</span>
              </div>
              <div className="relative rounded-xl overflow-hidden p-6 sm:p-8 bg-linear-to-r from-teal-950 via-slate-900 to-slate-900 border border-slate-800">
                {settings.hero_image && (
                  <div className="absolute inset-0 opacity-20">
                    <Image src={settings.hero_image} alt="Hero Background" fill className="object-cover" />
                  </div>
                )}
                <div className="relative z-10 max-w-xl space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                    {heroBadge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">{heroTitle}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{heroSubtitle}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">how_to_reg</span> {heroCtaText}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold">
                      Pelajari Profil Sekolah
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Form Fields */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Pengaturan Teks &amp; Tombol Hero</h3>
                <p className="text-xs text-slate-500">Edit headline utama dan tombol ajakan bertindak (CTA).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lencana / Tagline Atas (Badge)
                  </label>
                  <input
                    name="hero_badge"
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    placeholder="Contoh: Terakreditasi A (Unggul) • NPSN 20217851"
                    disabled={isPending}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Muncul di atas judul utama dalam badge berlatar hijau transparan.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Utama Banner (Headline)
                  </label>
                  <input
                    name="hero_title"
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    placeholder="Contoh: Mendidik Insan Unggul, Berkarakter & Adaptif Era Digital"
                    disabled={isPending}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi / Subjudul Hero
                  </label>
                  <textarea
                    name="hero_subtitle"
                    rows={3}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    placeholder="Tuliskan sambutan singkat 2-3 kalimat yang mewakili sekolah..."
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teks Tombol Utama (CTA 1)
                  </label>
                  <input
                    name="hero_cta_text"
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link Tombol Utama (CTA 1)
                  </label>
                  <input
                    name="hero_cta_link"
                    type="text"
                    defaultValue={settings.hero_cta_link || '/ppdb'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teks Tombol Sekunder (CTA 2)
                  </label>
                  <input
                    name="hero_secondary_text"
                    type="text"
                    defaultValue={settings.hero_secondary_text || 'Pelajari Profil Sekolah'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link Tombol Sekunder (CTA 2)
                  </label>
                  <input
                    name="hero_secondary_link"
                    type="text"
                    defaultValue={settings.hero_secondary_link || '/profil'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    disabled={isPending}
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Foto / Gambar Background Hero Banner (Format JPG/PNG/WebP, Maks 2MB)
                  </label>
                  <input
                    name="hero_image"
                    type="file"
                    accept="image/*"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                    disabled={isPending}
                  />
                  {settings.hero_image ? (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <Image src={settings.hero_image} alt="Hero saat ini" fill className="object-cover" />
                      </div>
                      <span className="text-[11px] text-teal-600 font-bold">Banner tersimpan aktif</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Jika belum diunggah, akan menggunakan latar gradien khas SMPN 5 Cibeber.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TICKER PENGUMUMAN BERJALAN */}
        {activeTab === 'ticker' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Pengumuman Berjalan (Marquee Ticker)</h3>
              <p className="text-xs text-slate-500">
                Pesan ini bergerak secara horizontal tepat di bawah hero banner di beranda untuk menarik perhatian pengunjung.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan Pengumuman 1
                </label>
                <input
                  name="ticker_text_1"
                  type="text"
                  defaultValue={
                    settings.ticker_text_1 ?? '📢 Pendaftaran PPDB 2025/2026 Jalur Zonasi & Prestasi Resmi Dibuka.'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan Pengumuman 2
                </label>
                <input
                  name="ticker_text_2"
                  type="text"
                  defaultValue={
                    settings.ticker_text_2 ?? '📅 Ujian Asesmen Sumatif Akhir Jenjang Kelas IX dimulai 12 Mei 2025.'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan Pengumuman 3
                </label>
                <input
                  name="ticker_text_3"
                  type="text"
                  defaultValue={
                    settings.ticker_text_3 ?? '🏆 Selamat atas Juara 1 Lomba OSN IPA Tingkat Kabupaten diraih siswa SMPN 5 Cibeber!'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATISTIK UTAMA (KEY STATS) */}
        {activeTab === 'stats' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Kartu Angka Statistik di Halaman Depan</h3>
              <p className="text-xs text-slate-500">
                Atur angka statistik yang dipamerkan di baris counter utama.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Siswa Aktif
                </label>
                <input
                  name="stat_students"
                  type="text"
                  defaultValue={settings.stat_students ?? '480'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
                <p className="text-[10px] text-slate-400 mt-1">Akan ditampilkan dengan tanda + (contoh: 480+)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Predikat Akreditasi
                </label>
                <input
                  name="school_accreditation"
                  type="text"
                  defaultValue={settings.school_accreditation ?? 'A'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
                <p className="text-[10px] text-slate-400 mt-1">Contoh: A (Unggul)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Ajaran PPDB Aktif
                </label>
                <input
                  name="ppdb_year"
                  type="text"
                  defaultValue={settings.ppdb_year ?? '2025/2026'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline Sub-Logo (Navbar)
                </label>
                <input
                  name="school_badge_text"
                  type="text"
                  defaultValue={settings.school_badge_text ?? 'Sekolah Penggerak'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAMBUTAN & VISI MISI */}
        {activeTab === 'kepsek' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Sambutan Pimpinan &amp; Visi Misi</h3>
              <p className="text-xs text-slate-500">
                Bagian ini tampil tepat di bawah tombol menu pintas di halaman beranda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  name="headmaster_name"
                  type="text"
                  defaultValue={settings.headmaster_name ?? 'Drs. H. Ahmad Fauzi, M.Pd.'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Pimpinan</label>
                <input
                  name="headmaster_title"
                  type="text"
                  defaultValue={settings.headmaster_title ?? 'Kepala Sekolah SMPN 5 Cibeber'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Sambutan Hangat Kepala Sekolah</label>
                <textarea
                  name="headmaster_welcome"
                  rows={4}
                  defaultValue={settings.headmaster_welcome ?? ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Visi Sekolah</label>
                <textarea
                  name="school_vision"
                  rows={2}
                  defaultValue={settings.school_vision ?? ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Misi Sekolah</label>
                <textarea
                  name="school_mission"
                  rows={4}
                  defaultValue={settings.school_mission ?? ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto Kepala Sekolah (Format JPG/PNG/WebP, Maks 2MB)
                </label>
                <input
                  name="headmaster_image"
                  type="file"
                  accept="image/*"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                  disabled={isPending}
                />
                {settings.headmaster_image && (
                  <p className="text-[11px] text-teal-600 font-bold mt-1">Foto kepala sekolah saat ini sudah tersimpan.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
          <div className="text-xs text-slate-600 hidden sm:block">
            <span>Perubahan akan langsung ter-render di website utama begitu disimpan.</span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 ml-auto"
          >
            {isPending && (
              <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{isPending ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Beranda'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
