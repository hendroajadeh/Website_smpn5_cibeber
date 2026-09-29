import { db } from '@/lib/db';
import AdminPpdbClient from './AdminPpdbClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Pendaftar PPDB' };
export default async function AdminPpdbPage() {
  const applicants = await db.ppdbApplicant.findMany({ orderBy: { createdAt: 'desc' } });
  const steps = await db.ppdbStep.findMany({ orderBy: { stepOrder: 'asc' } });
  const settingsRaw = await db.setting.findMany({
    where: { key: { in: ['ppdb_year', 'ppdb_quota', 'ppdb_open_date', 'ppdb_close_date', 'ppdb_announcement_date', 'ppdb_registration_date', 'ppdb_info'] } },
  });
  const settings = Object.fromEntries(settingsRaw.map((x) => [x.key, x.value]));

  return <AdminPpdbClient applicants={applicants} steps={steps} settings={settings} />;
}
