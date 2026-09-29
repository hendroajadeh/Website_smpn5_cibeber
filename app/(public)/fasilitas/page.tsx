import Image from 'next/image';
import { db } from '@/lib/db';
import { Buildings } from '@phosphor-icons/react/dist/ssr';
import { getCategoryLabel } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fasilitas',
  description: 'Fasilitas dan sarana prasarana SMPN 5 Cibeber.',
};

export default async function FasilitasPage() {
  const facilities = await db.facility.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  const categories = [...new Set(facilities.map((f) => f.category))];

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Fasilitas Sekolah</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Sarana dan prasarana pendukung pembelajaran di SMPN 5 Cibeber</p>
        </div>

        {facilities.length === 0 ? (
          <div className="card p-16 text-center">
            <Buildings size={40} className="text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Belum ada data fasilitas.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const items = facilities.filter((f) => f.category === category);
              return (
                <div key={category}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                    {getCategoryLabel(category)}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((facility) => (
                      <div key={facility.id} className="card card-interactive overflow-hidden">
                        {facility.imageUrl ? (
                          <div className="aspect-video relative bg-slate-100 dark:bg-zinc-800">
                            <Image
                              src={facility.imageUrl}
                              alt={facility.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center">
                            <Buildings size={36} className="text-slate-300 dark:text-zinc-600" weight="duotone" />
                          </div>
                        )}
                        <div className="p-4 space-y-1.5">
                          <h2 className="font-bold text-sm text-slate-900 dark:text-zinc-100">{facility.name}</h2>
                          {facility.description && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{facility.description}</p>
                          )}
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
    </div>
  );
}
