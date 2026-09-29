import { db } from '@/lib/db';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import {
  UserPlus,
  FileText,
  UploadSimple,
  CheckCircle,
  Megaphone,
  CheckSquare,
  WhatsappLogo,
  CalendarCheck,
  UsersThree,
  Info,
  ShieldCheck,
  FilePdf,
} from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Penerimaan Peserta Didik Baru (PPDB) — SMPN 5 Cibeber',
  description:
    'Informasi resmi PPDB SMPN 5 Cibeber: jadwal pendaftaran, kuota, persyaratan berkas, jalur zonasi/prestasi, dan panduan alur seleksi.',
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
      where: {
        key: {
          in: [
            'ppdb_year',
            'ppdb_quota',
            'ppdb_open_date',
            'ppdb_close_date',
            'ppdb_announcement_date',
            'ppdb_registration_date',
            'ppdb_info',
            'school_whatsapp',
            'school_phone',
          ],
        },
      },
    }),
  ]);
  return { steps, settings: Object.fromEntries(settings.map((x) => [x.key, x.value])) };
}

export default async function PpdbPage() {
  const { steps, settings } = await getPpdbData();
  const year = settings.ppdb_year ?? '2025/2026';
  const cleanWa = (settings.school_whatsapp ?? '6281234567890').replace(/[^0-9]/g, '');

  const waPpdbLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Halo Panitia PPDB SMPN 5 Cibeber, saya ingin berkonsultasi mengenai pendaftaran siswa baru tahun ajaran ${year}.`
  )}`;

  return (
    <div>
      {/* Header Hero Section — Academic Green (#1E5631) */}
      <section className="bg-gradient-to-b from-[#1E5631] via-[#1E5631] to-[#164325] text-white py-16 md:py-20 relative overflow-hidden border-b border-emerald-950/20">
        {/* Siluet Batik Mega Mendung Warna Putih Khusus Latar Hijau */}
        <MegaMendungPattern variant="white" opacity="opacity-[0.18]" />

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-amber-300">
            <span>PPDB Tahun Ajaran {year}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Penerimaan Peserta Didik Baru
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Selamat datang calon peserta didik generasi penerus. SMPN 5 Cibeber siap mendidik, membimbing, dan mengembangkan potensi Anda menjadi insan beriman, cerdas, dan berprestasi.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            {/* Tombol PPDB — Achievement Gold (#D97706) */}
            <a
              href={waPpdbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-gold font-bold shadow-lg shadow-emerald-950/20 active:scale-95 transition-all duration-200"
            >
              <WhatsappLogo size={20} weight="fill" />
              <span>Konsultasi Panitia PPDB</span>
            </a>
            <a
              href="#alur"
              className="btn btn-lg bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold backdrop-blur-xs active:scale-95 transition-all duration-200"
            >
              <Info size={20} />
              <span>Lihat Alur & Syarat</span>
            </a>
          </div>
        </div>
      </section>

      {/* Info Jadwal & Kuota Highlight */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              {
                label: 'Kuota Siswa Baru',
                value: settings.ppdb_quota ? `${settings.ppdb_quota} Siswa` : '240 Siswa',
                sub: '8 Rombongan Belajar',
                icon: UsersThree,
                highlight: true,
              },
              {
                label: 'Pendaftaran Dibuka',
                value: settings.ppdb_open_date ?? '1 Juni 2025',
                sub: 'Pukul 08.00 WIB',
                icon: CalendarCheck,
                highlight: false,
              },
              {
                label: 'Pendaftaran Ditutup',
                value: settings.ppdb_close_date ?? '30 Juni 2025',
                sub: 'Pukul 14.00 WIB',
                icon: CalendarCheck,
                highlight: false,
              },
              {
                label: 'Pengumuman Seleksi',
                value: settings.ppdb_announcement_date ?? '5 Juli 2025',
                sub: 'Daring & Papan Sekolah',
                icon: Megaphone,
                highlight: false,
              },
              {
                label: 'Daftar Ulang',
                value: settings.ppdb_registration_date ?? '7 - 10 Juli 2025',
                sub: 'Verifikasi Berkas Fisik',
                icon: CheckSquare,
                highlight: false,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-[#eaf4ed] border-[#1E5631]/30 col-span-2 md:col-span-1 shadow-xs'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon
                    size={22}
                    weight="duotone"
                    className={item.highlight ? 'text-[#1E5631] mb-2' : 'text-slate-400 mb-2'}
                  />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-base sm:text-lg font-extrabold text-[#1E293B] mt-0.5 leading-snug">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">{item.sub}</p>
                </div>
              );
            })}
          </div>

          {settings.ppdb_info && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#eaf4ed] border border-[#1E5631]/20 flex items-start gap-3">
              <ShieldCheck size={24} weight="fill" className="text-[#1E5631] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#1E293B] leading-relaxed font-medium">
                <span className="font-bold text-[#1E5631]">Ketentuan Resmi PPDB:</span> {settings.ppdb_info}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4 Jalur Pendaftaran */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            {/* Judul Utama — Academic Green (#1E5631) */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
              4 Jalur Pendaftaran Resmi
            </h2>
            <p className="text-xs sm:text-sm text-[#1E293B]/75">
              Pendaftaran peserta didik baru dilaksanakan sesuai regulasi Dinas Pendidikan dengan pembagian kuota:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Jalur Zonasi',
                quota: 'Kuota 50%',
                desc: 'Diperuntukkan bagi calon siswa dengan jarak domisili tempat tinggal terdekat ke lingkungan sekolah berdasarkan alamat Kartu Keluarga.',
                color: 'border-[#1E5631]/40 text-[#1E5631] bg-[#eaf4ed]',
              },
              {
                title: 'Jalur Prestasi',
                quota: 'Kuota 30%',
                desc: 'Berdasarkan akumulasi nilai rapor semester 1-5 SD atau piagam kejuaraan akademik, olahraga, sains, maupun seni tingkat kecamatan s/d internasional.',
                color: 'border-amber-300 text-[#b45309] bg-[#fef3c7]',
              },
              {
                title: 'Jalur Afirmasi',
                quota: 'Kuota 15%',
                desc: 'Khusus bagi calon peserta didik dari keluarga ekonomi tidak mampu (pemegang KIP, PKH, KKS) serta calon peserta didik penyandang disabilitas.',
                color: 'border-teal-500 text-teal-700 bg-teal-50/50',
              },
              {
                title: 'Perpindahan Tugas',
                quota: 'Kuota 5%',
                desc: 'Bagi calon siswa yang orang tua/walinya mengalami perpindahan tugas dinas resmi dari instansi pemerintah atau perusahaan yang dibuktikan surat penugasan.',
                color: 'border-slate-400 text-slate-700 bg-slate-100',
              },
            ].map((jalur, i) => (
              <div
                key={i}
                className="card p-6 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl shadow-xs"
              >
                <div className="space-y-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${jalur.color}`}>
                    {jalur.quota}
                  </span>
                  <h3 className="text-base font-bold text-[#1E293B]">{jalur.title}</h3>
                  <p className="text-xs text-[#1E293B]/75 leading-relaxed">{jalur.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persyaratan Berkas Dokumen */}
      <section className="section-padding bg-white border-y border-slate-200">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-10">
              {/* Judul Utama — Academic Green (#1E5631) */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
                Persyaratan Berkas Pendaftaran
              </h2>
              <p className="text-xs sm:text-sm text-[#1E293B]/75">
                Pastikan dokumen-dokumen berikut telah disiapkan baik dalam bentuk fisik maupun scan digital:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Syarat Umum */}
              <div className="card p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#1E293B] pb-2 border-b border-slate-200 flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" className="text-[#1E5631]" />
                  <span>Persyaratan Umum (Semua Jalur)</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#1E293B]/85">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1E5631] font-bold mt-0.5">&bull;</span>
                    <span>Surat Keterangan Lulus (SKL) / Ijazah SD/MI asli & fotokopi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1E5631] font-bold mt-0.5">&bull;</span>
                    <span>Fotokopi Akta Kelahiran calon peserta didik.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1E5631] font-bold mt-0.5">&bull;</span>
                    <span>Fotokopi Kartu Keluarga (KK) yang diterbitkan minimal 1 tahun.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1E5631] font-bold mt-0.5">&bull;</span>
                    <span>Fotokopi KTP kedua orang tua / wali murid.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1E5631] font-bold mt-0.5">&bull;</span>
                    <span>Pas foto formal ukuran 3x4 (3 lembar, latar biru/merah).</span>
                  </li>
                </ul>
              </div>

              {/* Syarat Khusus */}
              <div className="card p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#1E293B] pb-2 border-b border-slate-200 flex items-center gap-2">
                  <FilePdf size={18} weight="fill" className="text-[#D97706]" />
                  <span>Persyaratan Khusus (Sesuai Jalur)</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#1E293B]/85">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D97706] font-bold mt-0.5">&bull;</span>
                    <span><strong>Jalur Prestasi:</strong> Sertifikat/Piagam Kejuaraan asli & fotokopi yang telah dilegalisasi, atau fotokopi nilai rapor semester 1-5.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D97706] font-bold mt-0.5">&bull;</span>
                    <span><strong>Jalur Afirmasi:</strong> Kartu KIP, PKH, atau KKS yang masih aktif terdaftar di DTKS Kementerian Sosial.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D97706] font-bold mt-0.5">&bull;</span>
                    <span><strong>Jalur Perpindahan:</strong> Surat Keputusan / Surat Tugas Mutasi dari pimpinan lembaga/instansi resmi.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      {steps.length > 0 && (
        <section id="alur" className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
          {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
          <MegaMendungPattern opacity="opacity-[0.13]" />

          <div className="container-site max-w-4xl mx-auto relative z-10">
            <div className="text-center space-y-2 mb-12">
              {/* Judul Utama — Academic Green (#1E5631) */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
                Alur Lengkap Pendaftaran
              </h2>
              <p className="text-xs sm:text-sm text-[#1E293B]/75">
                Panduan tahapan dari pendaftaran hingga pengumuman dan daftar ulang
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => {
                const IconComponent = iconMap[step.icon] ?? FileText;
                return (
                  <div
                    key={step.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs flex items-start gap-4 sm:gap-6"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-[#1E5631] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20 font-extrabold text-base">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <IconComponent size={18} weight="bold" className="text-[#1E5631]" />
                        <h3 className="text-base font-bold text-[#1E293B]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1E293B]/75 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout — Academic Green & Achievement Gold */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1E5631] to-[#164325] text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-950/20">
              <div className="space-y-1">
                <h4 className="text-lg font-bold">Butuh Bantuan Pendaftaran?</h4>
                <p className="text-xs sm:text-sm text-emerald-100">
                  Panitia PPDB SMPN 5 Cibeber siap membantu proses verifikasi dan konsultasi pendaftaran Anda.
                </p>
              </div>
              <a
                href={waPpdbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-gold font-bold shrink-0 shadow-md active:scale-95 transition-all duration-200"
              >
                <WhatsappLogo size={20} weight="fill" />
                <span>Hubungi Panitia</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
