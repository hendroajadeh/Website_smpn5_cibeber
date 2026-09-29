import { db } from '@/lib/db';
import AdminFasilitasClient from './AdminFasilitasClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kelola Fasilitas' };
export default async function AdminFasilitasPage() {
  const facilities = await db.facility.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] });
  return <AdminFasilitasClient facilities={facilities} />;
}
