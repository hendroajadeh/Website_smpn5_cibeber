import { db } from '@/lib/db';
import AdminProfilClient from './AdminProfilClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kepala Sekolah & Visi Misi' };
export default async function AdminProfilPage() {
  const settings = await db.setting.findMany();
  return <AdminProfilClient settings={Object.fromEntries(settings.map(s => [s.key, s.value]))} />;
}
