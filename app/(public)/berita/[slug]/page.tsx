import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug, published: true } });
  if (!article) return { title: 'Berita tidak ditemukan' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug, published: true } });

  if (!article) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="max-w-3xl mx-auto">
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 hover:text-[#1e3a8a] dark:hover:text-blue-300 transition-colors mb-6">
            <ArrowLeft size={16} />
            Kembali ke Berita
          </Link>

          <article>
            <header className="mb-6 space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                <CalendarBlank size={15} />
                <time dateTime={(article.publishedAt ?? article.createdAt).toISOString()}>
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </time>
              </div>
            </header>

            {article.imageUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-slate-100 dark:bg-zinc-800">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
