'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  List,
  X,
  GraduationCap,
  House,
  Info,
  Buildings,
  Trophy,
  Newspaper,
  Images,
  PhoneCall,
  LockSimple,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  FilePdf,
  WhatsappLogo,
  Sparkle,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { href: '/', label: 'Beranda', icon: House },
  { href: '/profil', label: 'Profil', icon: Info },
  { href: '/fasilitas', label: 'Fasilitas', icon: Buildings },
  { href: '/prestasi', label: 'Prestasi', icon: Trophy },
  { href: '/berita', label: 'Warta & Agenda', icon: Newspaper },
  { href: '/galeri', label: 'Galeri', icon: Images },
  { href: '/kontak', label: 'Kontak', icon: PhoneCall },
];

interface NavbarProps {
  settings?: Record<string, string>;
}

export default function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const currentPath = selectedPath ?? pathname;
  const isActive = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  const activeHref = navLinks.find((l) => isActive(l.href))?.href ?? (currentPath === '/' ? '/' : null);

  const phone = settings?.school_phone || '(0263) 234-567';
  const whatsapp = settings?.school_whatsapp || '0812-3456-7890';
  const ppdbYear = settings?.ppdb_year || '2025/2026';
  const accreditation = settings?.school_accreditation || 'A';

  return (
    <>
      {/* 1. TOP UTILITY STRIP (SEKOLAH CIPUTRA STYLE) */}
      <div className="bg-[#143d22] text-emerald-100/90 text-[11px] sm:text-xs border-b border-emerald-900/60 hidden md:block">
        <div className="container-site">
          <div className="flex items-center justify-between h-9">
            {/* Left: Lokasi, Jam Belajar, Telepon Resmi */}
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-emerald-200/90">
                <MapPin size={13} weight="fill" className="text-amber-400" />
                <span>Kecamatan Cibeber, Kab. Lebak, Banten</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-200/90">
                <Clock size={13} weight="bold" className="text-emerald-300" />
                <span>Senin – Jumat: 07.00 – 15.30 WIB</span>
              </span>
              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors"
              >
                <Phone size={13} weight="fill" className="text-emerald-300" />
                <span>{phone}</span>
              </a>
            </div>

            {/* Right: Tautan Cepat & PPDB Direct Link */}
            <div className="flex items-center gap-4">
              <Link
                href="/ppdb#panduan"
                className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
              >
                <FilePdf size={14} weight="fill" className="text-rose-400" />
                <span>Brosur PPDB (PDF)</span>
              </Link>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SMPN%205%20Cibeber`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-200 hover:text-emerald-50 transition-colors font-medium"
              >
                <WhatsappLogo size={14} weight="fill" className="text-emerald-400" />
                <span>Hotline PPDB: {whatsapp}</span>
              </a>
              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-emerald-300/80 hover:text-white pl-2 border-l border-emerald-800 transition-colors"
                title="Portal Pengelola Sekolah"
              >
                <LockSimple size={12} weight="bold" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1E5631]/95 backdrop-blur-md border-b border-[#164325] shadow-md shadow-emerald-950/20'
            : 'bg-[#1E5631] border-b border-[#164325]'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-17 sm:h-20">
            {/* Logo & Brand Identity */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group py-1 active:scale-98 transition-transform"
              onClick={() => {
                setMobileOpen(false);
                setSelectedPath('/');
              }}
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white shadow-md shadow-emerald-950/15 flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/assets/logo-smpn5cibeber.png"
                  alt="Logo Resmi SMPN 5 Cibeber"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight leading-tight">
                  SMP NEGERI 5 CIBEBER
                </span>
                <p className="text-[11px] sm:text-xs font-medium text-emerald-100/90 leading-none mt-1">
                  Pusat Pendidikan Berkarakter &bull; Kabupaten Lebak, Provinsi Banten
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links — Apple/iPhone Style Segmented Control (Pindah Hanya Saat Dipencet) */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-inner shadow-black/5">
              {navLinks.map((link) => {
                const isSelected = activeHref === link.href;

                return (
                  <motion.div
                    key={link.href}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="relative shrink-0"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setSelectedPath(link.href)}
                      className={`relative block px-3.5 py-1.5 rounded-xl text-[13px] font-semibold tracking-wide whitespace-nowrap select-none transition-colors duration-150 z-10 ${
                        isSelected
                          ? 'text-white font-bold'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {/* iPhone / Apple Liquid Sliding Pill Indicator (Pindah Saat Dipencet) */}
                      {isSelected && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 rounded-xl -z-10 bg-white/25 border border-white/40 shadow-sm shadow-emerald-950/20 backdrop-blur-md"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 30,
                            mass: 0.8,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Right Action Elements */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Highlighted PPDB CTA Button — Apple Tactile Spring Feel */}
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/ppdb"
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-950/25 transition-all duration-200 whitespace-nowrap ${
                    isActive('/ppdb')
                      ? 'bg-[#B45309] text-white ring-2 ring-white/50'
                      : 'bg-gradient-to-r from-amber-500 to-[#D97706] hover:from-amber-600 hover:to-[#B45309] text-white'
                  }`}
                >
                  <span>Daftar PPDB {ppdbYear}</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </motion.div>

              {/* Mobile Hamburger Button */}
              <button
                className="xl:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu navigasi"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 top-[68px] z-30 bg-[#164325]/45 backdrop-blur-xs xl:hidden"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-2xl xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto"
              >
                <div className="container-site py-4 space-y-4">
                  {/* PPDB Hero Card on Mobile */}
                  <Link
                    href="/ppdb"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#B45309] text-white font-bold shadow-md shadow-amber-950/20 active:scale-98 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center p-1 shrink-0">
                        <Image
                          src="/assets/logo-smpn5cibeber.png"
                          alt="Logo Resmi SMPN 5 Cibeber"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold leading-tight">Pendaftaran PPDB {ppdbYear}</p>
                        <p className="text-[11px] text-amber-100 font-medium">Jalur Zonasi, Prestasi, & Afirmasi</p>
                      </div>
                    </div>
                    <ArrowRight size={18} weight="bold" />
                  </Link>

                  {/* Nav Links */}
                  <nav className="grid grid-cols-1 gap-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-98 ${
                            active
                              ? 'bg-[#eaf4ed] text-[#1E5631] font-bold'
                              : 'text-[#1E293B] hover:bg-slate-100 hover:text-[#1E5631]'
                          }`}
                        >
                          <Icon
                            size={19}
                            weight={active ? 'fill' : 'regular'}
                            className={active ? 'text-[#1E5631]' : 'text-slate-400'}
                          />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Quick Utility Links on Mobile */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 text-xs">
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SMPN%205%20Cibeber`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <WhatsappLogo size={16} weight="fill" className="text-emerald-600" />
                        <span>Hotline WhatsApp PPDB</span>
                      </span>
                      <span>{whatsapp}</span>
                    </a>

                    <div className="flex items-center justify-between pt-1 text-slate-500">
                      <Link
                        href="/admin/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 font-medium text-[#1E293B]"
                      >
                        <LockSimple size={15} weight="bold" />
                        <span>Portal Admin</span>
                      </Link>

                      <Link
                        href="/kontak"
                        onClick={() => setMobileOpen(false)}
                        className="font-semibold text-[#1E5631] hover:underline"
                      >
                        Hubungi Sekolah &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
