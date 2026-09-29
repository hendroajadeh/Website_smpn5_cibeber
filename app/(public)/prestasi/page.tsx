import { db } from '@/lib/db';
import { Trophy } from '@phosphor-icons/react/dist/ssr';
import { getLevelBadge } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestasi',
  description: 'Daftar prestasi dan penghargaan siswa dan sekolah SMPN 5 Cibeber.',
};

export default async function PrestasiPage() {
  const achievements = await db.achievement.findMany({
    where: { active: true },
    orderBy: [{ year: 'desc' }, { level: 'asc' }, { order: 'asc' }],
  });

  const years = [...new Set(achievements.map((a) => a.year))].sort((a, b) => b - a);

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Prestasi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Capaian membanggakan siswa dan SMPN 5 Cibeber</p>
        </div>

        {achievements.length === 0 ? (
          <div className="card p-16 text-center">
            <Trophy size={40} className="text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Belum ada data prestasi.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {years.map((year) => {
              const items = achievements.filter((a) => a.year === year);
              return (
                <div key={year}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800 font-mono">
                    Tahun {year}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((a) => {
                      const { label, class: badgeClass } = getLevelBadge(a.level);
                      return (
                        <div key={a.id} className="card p-5 flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 flex items-center justify-center shrink-0">
                            <Trophy size={20} className="text-amber-500" weight="duotone" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug">{a.title}</h2>
                              <span className={`badge ${badgeClass} shrink-0`}>{label}</span>
                            </div>
                            {a.description && (
                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">{a.description}</p>
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
    </div>
  );
}
