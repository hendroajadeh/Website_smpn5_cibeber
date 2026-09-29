'use client';

import { useState } from 'react';

type AdminHeaderProps = {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
};

export default function AdminHeader({ title = 'Dashboard Ikhtisar', subtitle = 'Ringkasan status publikasi & pendaftaran sekolah', onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl bg-slate-100">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={() => {}} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm shadow-teal-600/20">
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span className="hidden sm:inline">Simpan Semua</span>
        </button>
        <a href="/" target="_blank" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all">
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span className="hidden sm:inline">Lihat Web</span>
        </a>
      </div>
    </header>
  );
}
