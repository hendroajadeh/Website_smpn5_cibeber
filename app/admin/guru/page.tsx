import { db } from '@/lib/db';
import AdminGuruClient from './AdminGuruClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Direktori Guru & Staf' };
export default async function AdminGuruPage() {
  const staff = await db.staff.findMany({ orderBy: [{ level: 'asc' }, { order: 'asc' }] });
  return <AdminGuruClient staff={staff} />;
}
