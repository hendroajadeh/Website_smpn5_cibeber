import Image from 'next/image';
import { db } from '@/lib/db';
import { Images } from '@phosphor-icons/react/dist/ssr';
import { getCategoryLabel } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Galeri foto kegiatan, prestasi, dan fasilitas SMPN 5 Cibeber.',
};

export default async function GaleriPage() {
  const galleries = await db.gallery.findMany({
    where: { active: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  const categories = ['SEMUA', ...new Set(galleries.map((g) => g.category))];

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Galeri</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Foto kegiatan, prestasi, dan fasilitas SMPN 5 Cibeber</p>
        </div>

        {galleries.length === 0 ? (
          <div className="card p-16 text-center">
            <Images size={40} className="text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Belum ada foto di galeri.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.filter(c => c !== 'SEMUA').map((category) => {
              const items = galleries.filter((g) => g.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                    {getCategoryLabel(category)}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="card card-interactive overflow-hidden group p-0">
                        <div className="aspect-square relative bg-slate-100 dark:bg-zinc-800">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 truncate">{item.title}</p>
                          {item.description && (
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 truncate">{item.description}</p>
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
