import { db } from '@/lib/db';
import AdminProfilClient from './AdminProfilClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kelola Profil & Staf' };
export default async function AdminProfilPage() {
  const [staff, settings] = await Promise.all([
    db.staff.findMany({ orderBy: [{ level: 'asc' }, { order: 'asc' }] }),
    db.setting.findMany({ where: { group: { in: ['GENERAL', 'HEADMASTER', 'SCHOOL_INFO', 'MAPS'] } } }),
  ]);
  return <AdminProfilClient staff={staff} settings={Object.fromEntries(settings.map(s => [s.key, s.value]))} />;
}
