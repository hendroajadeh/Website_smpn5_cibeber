'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminShell({ children, userEmail, userName, pageTitle, pageSubtitle }: { children: React.ReactNode, userEmail: string, userName: string, pageTitle?: string, pageSubtitle?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-[100dvh] text-slate-800 font-sans antialiased flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:static md:translate-x-0 shrink-0 h-full ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar userEmail={userEmail} userName={userName} />
      </div>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <AdminHeader 
          title={pageTitle} 
          subtitle={pageSubtitle} 
          onMenuClick={() => setMobileOpen(true)} 
        />

        {/* Main Dynamic Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
