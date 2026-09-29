import { db } from '@/lib/db';
import ArticleSearchFilter, { ArticleItem } from '@/components/ui/ArticleSearchFilter';
import { Newspaper } from '@phosphor-icons/react/dist/ssr';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warta & Pengumuman Sekolah',
  description: 'Kabar terkini seputar kegiatan belajar, agenda sekolah, pengumuman, dan prestasi SMPN 5 Cibeber.',
};

export default async function BeritaPage() {
  const rawArticles = await db.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  const articles: ArticleItem[] = rawArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    imageUrl: a.imageUrl,
    createdAt: a.createdAt,
    publishedAt: a.publishedAt,
  }));

  return (
    <div>
      {/* Hero Banner Warta — Background Hijau Institusional dengan Siluet Mega Mendung Putih */}
      <section className="relative overflow-hidden text-white py-16 md:py-20 bg-gradient-to-b from-[#1E5631] via-[#1E5631] to-[#143e22] border-b border-emerald-950/20">
        {/* Siluet Batik Mega Mendung Warna Putih Khusus Latar Hijau */}
        <MegaMendungPattern variant="white" opacity="opacity-[0.18]" />

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <Newspaper size={16} weight="fill" />
            <span>Pusat Informasi &amp; Publikasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Warta &amp; Agenda Sekolah
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            Ikuti dinamika kegiatan kesiswaan, rilis pengumuman akademik resmi, liputan prestasi, dan agenda penting di lingkungan SMPN 5 Cibeber.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-xs">
              {articles.length} Artikel Terbit
            </span>
          </div>
        </div>
      </section>

      {/* Katalog Berita & Filter Pencarian dengan Siluet Batik Mega Mendung */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <ArticleSearchFilter articles={articles} />
        </div>
      </section>
    </div>
  );
}
