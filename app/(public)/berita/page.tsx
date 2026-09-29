import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';
import { Newspaper } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Berita dan informasi terbaru seputar kegiatan SMPN 5 Cibeber.',
};

export default async function BeritaPage() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Berita Terkini</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Informasi terbaru seputar kegiatan SMPN 5 Cibeber</p>
        </div>

        {articles.length === 0 ? (
          <div className="card p-16 text-center">
            <Newspaper size={40} className="text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/berita/${article.slug}`}
                className="card card-interactive p-0 overflow-hidden flex flex-col group"
              >
                <div className="aspect-video relative bg-slate-100 dark:bg-zinc-800">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper size={32} className="text-slate-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col gap-2">
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                    {formatDateShort(article.publishedAt ?? article.createdAt)}
                  </p>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug group-hover:text-[#1e3a8a] dark:group-hover:text-blue-300 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
