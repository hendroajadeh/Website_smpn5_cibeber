import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin SMPN 5 Cibeber' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <AdminShell 
      userName={session?.name ?? 'Admin IT Sekolah'} 
      userEmail={session?.email ?? 'admin@smpn5cibeber.sch.id'}
    >
      {children}
    </AdminShell>
  );
}
