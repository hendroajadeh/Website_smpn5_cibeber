'use client';

import { useState, useTransition } from 'react';
import { logoutAction } from '@/actions/auth';
import { SignOut, User } from '@phosphor-icons/react';

type AdminHeaderProps = {
  userName?: string;
  userEmail?: string;
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
};

export default function AdminHeader({
  userName = 'Administrator',
  userEmail = 'admin@smpn5cibeber.sch.id',
  title = 'Panel Admin',
  subtitle,
  onMenuClick,
}: AdminHeaderProps) {
  const [isPending, startTransition] = useTransition();
  const [showDropdown, setShowDropdown] = useState(false);

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-slate-700">
          Panel Admin
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 p-1.5 pl-3 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900">{userName}</p>
            <p className="text-[10px] text-slate-400">{userEmail}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
            <User size={16} className="text-[#1e3a8a]" weight="duotone" />
          </div>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 w-48 card p-1 shadow-md">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
              >
                <SignOut size={14} />
                {isPending ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
