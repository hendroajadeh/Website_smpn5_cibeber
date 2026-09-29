import { db } from '@/lib/db';
import AdminGaleriClient from './AdminGaleriClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kelola Galeri' };
export default async function AdminGaleriPage() {
  const galleries = await db.gallery.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return <AdminGaleriClient galleries={galleries} />;
}
