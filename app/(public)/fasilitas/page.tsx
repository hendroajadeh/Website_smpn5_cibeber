import Image from 'next/image';
import { db } from '@/lib/db';
import { Buildings, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { getCategoryLabel } from '@/lib/utils';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fasilitas & Sarana Prasarana Sekolah',
  description: 'Daftar fasilitas laboratorium komputer, perpustakaan, lapangan olahraga, musala, dan ruang kelas SMPN 5 Cibeber.',
};

export default async function FasilitasPage() {
  const facilities = await db.facility.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  const categories = Array.from(new Set(facilities.map((f) => f.category)));

  return (
    <div>
      {/* Hero Banner Fasilitas — Background Foto Lapangan & Gedung dengan Tint Hijau Lembut */}
      <section className="relative overflow-hidden text-white py-16 md:py-20 border-b border-emerald-950/20">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/lapangan-smpn5cibeber.jpg"
            alt="Sarana & Fasilitas Kampus SMPN 5 Cibeber"
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Lapangan & Panggung Terlihat Jelas */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/75 via-[#1E5631]/65 to-[#143e22]/88" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
        </div>

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <Buildings size={16} weight="fill" />
            <span>Sarana &amp; Prasarana Kampus</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Fasilitas Pembelajaran Sekolah
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            SMP Negeri 5 Cibeber terus berbenah dan melengkapi sarana pembelajaran modern guna mendukung potensi akademik, olahraga, sains, dan kreativitas putra-putri kita.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-xs">
              {facilities.length} Fasilitas Siap Pakai
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 font-semibold shadow-xs">
              {categories.length} Kategori Sarana
            </span>
          </div>
        </div>
      </section>

      {/* Katalog Sarana Sekolah dengan Siluet Batik Mega Mendung */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          {facilities.length === 0 ? (
            <div className="card p-16 text-center space-y-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-2xl">
              <Buildings size={40} className="text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium">Belum ada data fasilitas.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const items = facilities.filter((f) => f.category === category);
                return (
                  <div key={category} className="space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/90">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#1E5631]">
                        {getCategoryLabel(category)}
                      </span>
                      <span className="text-xs text-slate-400">({items.length} sarana)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((facility) => (
                        <div
                          key={facility.id}
                          className="card card-interactive overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 group"
                        >
                          {facility.imageUrl ? (
                            <div className="aspect-16/10 relative bg-slate-100 overflow-hidden">
                              <Image
                                src={facility.imageUrl}
                                alt={facility.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>
                          ) : (
                            <div className="aspect-16/10 bg-linear-to-br from-[#eaf4ed] to-slate-100 flex items-center justify-center text-[#1E5631]/40">
                              <Buildings size={44} weight="duotone" />
                            </div>
                          )}
                          <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h2 className="font-bold text-base text-[#1E293B] group-hover:text-[#1E5631] transition-colors leading-snug">
                                {facility.name}
                              </h2>
                              {facility.description && (
                                <p className="text-xs sm:text-sm text-[#1E293B]/75 leading-relaxed line-clamp-3 mt-1.5">
                                  {facility.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
