import Image from 'next/image';
import { db } from '@/lib/db';
import GalleryLightbox, { GalleryItem } from '@/components/ui/GalleryLightbox';
import { Images } from '@phosphor-icons/react/dist/ssr';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri Sekolah',
  description: 'Dokumentasi foto kegiatan belajar, ekstrakurikuler, prestasi, dan fasilitas SMPN 5 Cibeber.',
};

export default async function GaleriPage() {
  const rawGalleries = await db.gallery.findMany({
    where: { active: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  const galleries: GalleryItem[] = rawGalleries.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    imageUrl: g.imageUrl,
    category: g.category,
  }));

  const categories = Array.from(new Set(galleries.map((g) => g.category)));

  return (
    <div>
      {/* Hero Banner Galeri — Background Foto Lapangan & Kampus dengan Tint Hijau Lembut */}
      <section className="relative overflow-hidden text-white py-16 md:py-20 border-b border-emerald-950/20">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/lapangan-smpn5cibeber.jpg"
            alt="Galeri Dokumentasi SMPN 5 Cibeber"
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Lapangan Terlihat Jelas */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/75 via-[#1E5631]/65 to-[#143e22]/88" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
        </div>

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <Images size={16} weight="fill" />
            <span>Dokumentasi &amp; Arsip Visual</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Galeri Kegiatan Sekolah
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            Kumpulan potret momen berharga, dinamika belajar mengajar, ekstrakurikuler, karya siswa, serta sarana lingkungan di SMPN 5 Cibeber.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-xs">
              {galleries.length} Foto Dokumentasi
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 font-semibold shadow-xs">
              {categories.length} Kategori Album
            </span>
          </div>
        </div>
      </section>

      {/* Grid Galeri & Lightbox dengan Siluet Batik Mega Mendung */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <GalleryLightbox items={galleries} />
        </div>
      </section>
    </div>
  );
}
