import { db } from '@/lib/db';
import AdminPpdbClient from './AdminPpdbClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kelola PPDB' };
export default async function AdminPpdbPage() {
  const [steps, settings] = await Promise.all([
    db.ppdbStep.findMany({ orderBy: { stepOrder: 'asc' } }),
    db.setting.findMany({ where: { group: 'PPDB' } }),
  ]);
  return <AdminPpdbClient steps={steps} settings={Object.fromEntries(settings.map(s => [s.key, s.value]))} />;
}
