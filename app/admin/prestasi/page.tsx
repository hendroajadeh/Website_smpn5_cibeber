import { db } from '@/lib/db';
import AdminPrestasiClient from './AdminPrestasiClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kelola Prestasi' };
export default async function AdminPrestasiPage() {
  const achievements = await db.achievement.findMany({ orderBy: [{ year: 'desc' }, { order: 'asc' }] });
  return <AdminPrestasiClient achievements={achievements} />;
}
