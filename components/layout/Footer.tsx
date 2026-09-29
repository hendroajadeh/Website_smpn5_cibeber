import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container-high/60 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 relative flex items-center justify-center bg-primary rounded-lg shrink-0">
                 <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <div>
                <p className="font-bold text-primary text-sm">{settings.school_name || 'SMPN 5 CIBEBER'}</p>
                <p className="text-[11px] text-secondary font-semibold">NPSN: 20601894 • Akreditasi {settings.school_accreditation || 'A'}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Mendidik generasi berkarakter Profil Pelajar Pancasila, literat teknologi, berbudaya lingkungan, dan berwawasan global.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Tautan Cepat</h4>
            <ul className="text-xs text-on-surface-variant flex flex-col gap-2">
              <li><Link href="/" className="hover:text-primary">Beranda Sekolah</Link></li>
              <li><Link href="/profil" className="hover:text-primary">Profil Sekolah</Link></li>
              <li><Link href="/fasilitas" className="hover:text-primary">Fasilitas Sekolah</Link></li>
              <li><Link href="/berita" className="hover:text-primary">Warta &amp; Agenda</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Layanan</h4>
            <ul className="text-xs text-on-surface-variant flex flex-col gap-2">
              <li><Link href="/ppdb" className="hover:text-secondary font-bold text-secondary text-left">PPDB Online 2025/2026</Link></li>
              <li><a href="https://dapo.kemdikbud.go.id" target="_blank" rel="noreferrer" className="hover:text-primary">Portal Dapodik</a></li>
              <li><a href="https://belajar.id" target="_blank" rel="noreferrer" className="hover:text-primary">Akun Belajar.id</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Kontak Sekolah</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {settings.school_address || 'Jl. Raya Cibeber Km. 4'}<br />
              Email: {settings.school_email || 'info@smpn5cibeber.sch.id'}<br />
              Hotline: {settings.school_phone || '0812-3456-7890'}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
          <p>© {new Date().getFullYear()} {settings.school_name || 'SMP Negeri 5 Cibeber'}. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>Desain Resmi Portal Sekolah Standar Kemendikbudristek</p>
        </div>
      </div>
    </footer>
  );
}
