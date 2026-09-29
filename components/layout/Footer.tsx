import Link from 'next/link';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import {
  GraduationCap,
  Phone,
  Envelope,
  MapPin,
  WhatsappLogo,
  Clock,
  ShieldCheck,
  LockSimple,
} from '@phosphor-icons/react/dist/ssr';

type FooterProps = {
  settings?: Record<string, string>;
};

export default function Footer({ settings = {} }: FooterProps) {
  const schoolName = settings.school_name ?? 'SMPN 5 Cibeber';
  const address =
    settings.school_address ?? 'Jl. Raya Cibeber No.5, Kecamatan Cibeber, Kabupaten Cianjur, Jawa Barat 43261';
  const phone = settings.school_phone ?? '(0266) 6321234';
  const email = settings.school_email ?? 'smpn5cibeber@gmail.com';
  const whatsapp = settings.school_whatsapp ?? '6281234567890';
  const accreditation = settings.school_accreditation ?? 'A';
  const npsn = settings.school_npsn ?? '20217851';
  const year = new Date().getFullYear();

  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="relative overflow-hidden bg-[#1E5631] text-emerald-100/90 border-t border-[#164325]">
      {/* Siluet Batik Mega Mendung Warna Putih Khas Jawa Barat */}
      <MegaMendungPattern variant="white" opacity="opacity-[0.16]" />

      {/* Top Banner / Trust bar */}
      <div className="relative z-10 border-b border-[#164325] bg-[#164325]/70 py-6">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 font-semibold">
              <ShieldCheck size={16} weight="fill" className="text-amber-300" />
              Terakreditasi {accreditation} (BAN-S/M)
            </span>
            <span className="text-emerald-200/90 font-mono">NPSN: {npsn}</span>
          </div>

          <p className="text-emerald-100/90 text-center sm:text-right font-medium">
            Mendidik Generasi Beriman, Berprestasi, dan Berkarakter Mulia
          </p>
        </div>
      </div>

      <div className="container-site relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0">
                <GraduationCap size={22} weight="fill" className="text-[#1E5631]" />
              </div>
              <div>
                <p className="font-extrabold text-white text-base tracking-tight">{schoolName}</p>
                <p className="text-xs text-emerald-200/90">Kabupaten Lebak, Provinsi Banten</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Lembaga pendidikan formal tingkat menengah pertama negeri yang berdedikasi melahirkan siswa berakhlak terpuji, cerdas, berprestasi, dan siap menghadapi era digital.
            </p>
            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWa}?text=Halo%20SMPN%205%20Cibeber,%20saya%20ingin%20bertanya%20informasi%20sekolah.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold active:scale-95 transition-all shadow-md shadow-amber-950/20"
              >
                <WhatsappLogo size={18} weight="fill" />
                <span>Chat WhatsApp Resmi</span>
              </a>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <span>Navigasi Cepat</span>
            </p>
            <ul className="space-y-2 text-xs">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/profil', label: 'Profil & Visi Misi' },
                { href: '/fasilitas', label: 'Fasilitas Sekolah' },
                { href: '/prestasi', label: 'Daftar Prestasi Siswa' },
                { href: '/berita', label: 'Warta & Pengumuman' },
                { href: '/galeri', label: 'Galeri Foto Kegiatan' },
                { href: '/ppdb', label: 'Pendaftaran PPDB Online' },
                { href: '/kontak', label: 'Peta Lokasi & Kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-emerald-100/80 hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                  >
                    <span className="text-amber-400">&rsaquo;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan & Jam Operasional */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Clock size={15} weight="bold" />
              <span>Jam Operasional</span>
            </p>
            <div className="space-y-3 text-xs text-emerald-100/90">
              <div className="p-3.5 rounded-xl bg-[#164325]/80 border border-white/10 space-y-1">
                <p className="text-white font-semibold">Pelayanan Tata Usaha (TU):</p>
                <p>Senin – Kamis: 07.30 – 15.00 WIB</p>
                <p>Jumat: 07.30 – 11.30 WIB</p>
                <p>Sabtu – Minggu / Libur: Tutup</p>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                Untuk pertanyaan di luar jam kerja, Anda dapat mengirimkan pesan melalui form kontak atau WhatsApp sekolah.
              </p>
            </div>
          </div>

          {/* Col 4: Informasi Kontak & Alamat */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">Alamat & Kontak</p>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-emerald-100/90">
                <MapPin size={17} className="shrink-0 mt-0.5 text-amber-300" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-emerald-100/90">
                <Phone size={17} className="shrink-0 text-emerald-300" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-emerald-100/90">
                <Envelope size={17} className="shrink-0 text-amber-300" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="border-t border-[#164325] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p className="text-center sm:text-left">
            &copy; {year} {schoolName}. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#164325] border border-white/15 hover:border-white/30 text-emerald-100 hover:text-white transition-all active:scale-95"
            >
              <LockSimple size={13} weight="bold" />
              <span>Portal Administrator</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
