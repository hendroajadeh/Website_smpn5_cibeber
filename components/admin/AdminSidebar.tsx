'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem =
  | { group: string; href?: never; label?: never; icon?: never; status?: never; badge?: never; alert?: never }
  | { group?: never; href: string; label: string; icon: string; status?: string; badge?: string; alert?: string };

const navItems: NavItem[] = [
  { group: 'Ringkasan & Profil' },
  { href: '/admin', label: 'Dashboard Ikhtisar', icon: 'dashboard' },
  { href: '/admin/beranda', label: 'Tampilan Beranda', icon: 'view_quilt' },
  { href: '/admin/pengaturan', label: 'Identitas & Kontak', icon: 'school' },
  { href: '/admin/profil', label: 'Kepsek & Visi Misi', icon: 'psychology' },
  { group: 'Publikasi Informasi' },
  { href: '/admin/berita', label: 'Artikel Berita', icon: 'newspaper' },
  { href: '/admin/prestasi', label: 'Prestasi Siswa', icon: 'emoji_events' },
  { href: '/admin/galeri', label: 'Dokumentasi Galeri', icon: 'images' },
  { group: 'Civitas & Sarana' },
  { href: '/admin/guru', label: 'Direktori Guru', icon: 'groups' },
  { href: '/admin/fasilitas', label: 'Fasilitas & Ekskul', icon: 'apartment' },
  { group: 'Layanan Masuk' },
  { href: '/admin/ppdb', label: 'Pendaftar PPDB', icon: 'how_to_reg' },
];

export default function AdminSidebar({ userEmail, userName }: { userEmail: string, userName: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false); // Mobile state handled by layout or here

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <>
      <aside
        id="sidebar"
        className="w-72 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 h-full"
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white">CMS Admin</div>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">SMPN 5 Cibeber</div>
            </div>
          </div>
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
          {navItems.map((item, index) => {
            if (item.group) {
              return (
                <div key={index} className={`px-3 ${index !== 0 ? 'pt-4' : ''} pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider`}>
                  {item.group}
                </div>
              );
            }

            const active = isActive(item.href!);
            
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  active
                    ? 'bg-white/15 text-white font-bold'
                    : 'font-semibold text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.status && (
                  <span className="bg-teal-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white">{item.status}</span>
                )}
                {item.badge && (
                  <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-300">{item.badge}</span>
                )}
                {item.alert && (
                  <span className="bg-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-900">{item.alert}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
          </div>
          <Link href="/" title="Kembali ke Web" className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
