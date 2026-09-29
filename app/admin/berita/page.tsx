import { db } from '@/lib/db';
import AdminBeritaClient from './AdminBeritaClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kelola Berita' };

export default async function AdminBeritaPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return <AdminBeritaClient articles={articles} />;
}
