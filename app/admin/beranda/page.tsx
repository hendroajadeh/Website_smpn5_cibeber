import { db } from '@/lib/db';
import AdminBerandaClient from './AdminBerandaClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Tampilan Beranda',
};

export default async function AdminBerandaPage() {
  const settings = await db.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return <AdminBerandaClient settings={settingsMap} />;
}
