import { db } from '@/lib/db';
import AdminPengaturanClient from './AdminPengaturanClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Pengaturan' };
export default async function AdminPengaturanPage() {
  const settings = await db.setting.findMany();
  return <AdminPengaturanClient settings={Object.fromEntries(settings.map(s => [s.key, s.value]))} />;
}
