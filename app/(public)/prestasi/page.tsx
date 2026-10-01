import Image from 'next/image';
import { db } from '@/lib/db';
import { Trophy } from '@phosphor-icons/react/dist/ssr';
import { getLevelBadge } from '@/lib/utils';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestasi & Penghargaan Siswa',
  description: 'Daftar raihan juara, penghargaan, dan prestasi akademik serta non-akademik siswa SMPN 5 Cibeber.',
};

export default async function PrestasiPage() {
  const achievements = await db.achievement.findMany({
    where: { active: true },
    orderBy: [{ year: 'desc' }, { level: 'asc' }, { order: 'asc' }],
  });

  const years = Array.from(new Set(achievements.map((a) => a.year))).sort((a, b) => b - a);

  return (
    <div>
      {/* Hero Banner Prestasi — Background Foto Tim Siswa Marching Band dengan Tint Hijau Lembut */}
      <section className="relative overflow-hidden text-white py-16 md:py-20 border-b border-emerald-950/20">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/prestasi-siswa-smpn5cibeber.jpg"
            alt="Prestasi Siswa SMP Negeri 5 Cibeber"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
          {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Siswa Terlihat Nyata & Berwarna */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/78 via-[#1E5631]/65 to-[#143e22]/88" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
        </div>

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <Trophy size={16} weight="fill" />
            <span>Rekam Jejak Prestasi Siswa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Prestasi &amp; Kejuaraan Siswa
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            Bukti nyata dedikasi belajar, bakat istimewa, serta bimbingan dewan guru dalam mengantarkan siswa-siswi SMPN 5 Cibeber meraih kejuaraan di berbagai tingkatan.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-xs">
              {achievements.length} Total Penghargaan
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 font-semibold shadow-xs">
              Dokumentasi {years.length} Tahun Terakhir
            </span>
          </div>
        </div>
      </section>

      {/* Katalog Prestasi dengan Siluet Batik Mega Mendung */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          {achievements.length === 0 ? (
            <div className="card p-16 text-center space-y-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-2xl">
              <Trophy size={40} className="text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium">Belum ada data prestasi.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map((year) => {
                const items = achievements.filter((a) => a.year === year);
                return (
                  <div key={year} className="space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/90">
                      <span className="text-sm font-extrabold font-mono text-[#1E5631]">
                        Tahun {year}
                      </span>
                      <span className="text-xs text-slate-400">({items.length} penghargaan)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map((a) => {
                        const { label, class: badgeClass } = getLevelBadge(a.level);
                        return (
                          <div
                            key={a.id}
                            className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex items-start gap-4 group"
                          >
                            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Trophy size={22} className="text-[#D97706]" weight="duotone" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <h2 className="text-sm sm:text-base font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors leading-snug">
                                  {a.title}
                                </h2>
                                <span className={`badge ${badgeClass} shrink-0`}>{label}</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                Tingkat: {label}
                              </p>
                              {a.description && (
                                <p className="text-xs text-[#1E293B]/75 leading-relaxed pt-1">
                                  {a.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
