'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Warta & Agenda' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/kontak', label: 'Kontak' },
];

interface NavbarProps {
  settings?: Record<string, string>;
}

export default function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container/60 shadow-xs">
        {/* Top Contact Strip */}
        <div className="bg-primary-container text-on-primary text-[11px] sm:text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
            <div className="flex items-center gap-4 truncate">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">mail</span> {settings?.school_email || 'smpn5cibeber@gmail.com'}
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">schedule</span> Senin - Sabtu: 07:00 - 15:00 WIB
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/ppdb" className="flex items-center gap-1 bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full font-bold text-[10px] sm:text-[11px] hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-[13px]">call</span>
                <span>Hotline PPDB: {settings?.school_phone || settings?.school_whatsapp || '0812-3456-7890'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 sm:h-12 w-10 sm:w-12 relative flex items-center justify-center bg-primary rounded-lg">
               <span className="material-symbols-outlined text-white text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-primary tracking-tight">
                {settings?.school_name_short || settings?.school_name || 'SMPN 5 CIBEBER'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-secondary font-bold uppercase tracking-wider">
                {settings?.school_badge_text || 'Sekolah Penggerak'}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${isActive(link.href) ? 'text-secondary' : 'hover:text-secondary'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            
            <Link href="/ppdb" className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span className="hidden sm:inline">PPDB Online</span>
              <span className="sm:hidden">PPDB</span>
            </Link>
            
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface-container">
              <span className="material-symbols-outlined text-[24px]">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container px-6 py-4 flex flex-col gap-3 text-sm font-semibold text-primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-1 transition-colors ${isActive(link.href) ? 'text-secondary' : 'hover:text-secondary'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
