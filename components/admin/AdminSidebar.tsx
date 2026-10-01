'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  ChartPieSlice,
  Newspaper,
  Users,
  Images,
  Buildings,
  Trophy,
  UsersFour,
  GearSix,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: ChartPieSlice, exact: true },
  { href: '/admin/berita', label: 'Berita', icon: Newspaper },
  { href: '/admin/profil', label: 'Profil & Staf', icon: Users },
  { href: '/admin/galeri', label: 'Galeri', icon: Images },
  { href: '/admin/fasilitas', label: 'Fasilitas', icon: Buildings },
  { href: '/admin/prestasi', label: 'Prestasi', icon: Trophy },
  { href: '/admin/ppdb', label: 'PPDB', icon: UsersFour },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: GearSix },
];

export default function AdminSidebar({
  userEmail,
  userName,
}: {
  userEmail?: string;
  userName?: string;
} = {}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center border-b border-slate-200 h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-[#1e3a8a] flex items-center justify-center shrink-0">
              <GraduationCap size={15} weight="fill" className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">SMPN 5 Cibeber</p>
              <p className="text-[10px] text-slate-400">Panel Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {collapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                active
                  ? 'bg-[#1e3a8a]/10 text-[#1e3a8a]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={16} weight={active ? 'duotone' : 'regular'} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* View site link */}
      {!collapsed && (
        <div className="p-2 border-t border-slate-200">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Lihat website publik
          </Link>
        </div>
      )}
    </aside>
  );
}
