import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
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
    <div className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
      {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
      <MegaMendungPattern opacity="opacity-[0.11]" />

      <div className="container-site relative z-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1E5631] active:scale-95 transition-all mb-6 font-medium">
            <ArrowLeft size={16} weight="bold" />
            Kembali ke Berita
          </Link>

          {/* Card / Container — Pure White (#FFFFFF) for Wadah Berita / Artikel */}
          <article className="card p-6 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
            <header className="mb-6 space-y-4">
              {/* Judul Utama — Academic Green (#1E5631) */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E5631] tracking-tight leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarBlank size={15} />
                <time dateTime={(article.publishedAt ?? article.createdAt).toISOString()}>
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </time>
              </div>
            </header>

            {article.imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100">
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

            {/* Teks isi berita & deskripsi — Dark Charcoal (#1E293B) */}
            <div
              className="prose-content text-[#1E293B]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
