'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlass,
  X,
  CalendarBlank,
  ArrowRight,
  Newspaper,
} from '@phosphor-icons/react';
import { formatDateShort } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: Date | string;
  publishedAt: Date | string | null;
};

type ArticleSearchFilterProps = {
  articles: ArticleItem[];
};

export default function ArticleSearchFilter({ articles }: ArticleSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Bar Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita atau topik..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E5631]/20 focus:border-[#1E5631] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              aria-label="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-[#1E293B]">{filtered.length}</span> berita
        </p>
      </div>

      {/* List / Grid Articles — Pure White Containers (#FFFFFF) */}
      {filtered.length === 0 ? (
        <div className="card p-12 sm:p-16 text-center space-y-3 bg-white shadow-xs">
          <Newspaper size={44} className="text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#1E293B]">
            Tidak ada berita yang sesuai
          </h3>
          <p className="text-xs sm:text-sm text-[#1E293B]/70 max-w-sm mx-auto">
            Tidak ditemukan artikel dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn btn-secondary btn-sm inline-flex mt-2"
          >
            Hapus Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((article, idx) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
              >
                <Link
                  href={`/berita/${article.slug}`}
                  className="card card-interactive p-0 overflow-hidden flex flex-col group h-full bg-white border border-slate-200 rounded-2xl active:scale-98 transition-transform shadow-xs"
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-16/10 relative bg-slate-100 overflow-hidden">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <Newspaper size={36} className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Body Content — Pure White Card Container (#FFFFFF) */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        <CalendarBlank size={13} />
                        <span>{formatDateShort(article.publishedAt ?? article.createdAt)}</span>
                      </div>

                      <h2 className="text-base font-bold text-[#1E293B] leading-snug group-hover:text-[#1E5631] transition-colors">
                        {article.title}
                      </h2>

                      {/* Teks isi berita & deskripsi — Dark Charcoal (#1E293B) */}
                      <p className="text-xs sm:text-sm text-[#1E293B]/75 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E5631] group-hover:translate-x-0.5 transition-transform">
                      <span>Baca artikel</span>
                      <ArrowRight size={14} weight="bold" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
