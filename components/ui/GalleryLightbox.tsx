'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  Images,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategoryLabel } from '@/lib/utils';

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
};

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState<string>('SEMUA');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = ['SEMUA', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    activeCategory === 'SEMUA'
      ? items
      : items.filter((i) => i.category === activeCategory);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
    );
  }, [selectedIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
    );
  }, [selectedIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap active:scale-95 transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-[#1E5631] text-white shadow-sm shadow-emerald-950/20'
                : 'bg-white text-[#1E293B] border border-slate-200 hover:bg-[#eaf4ed] hover:text-[#1E5631]'
            }`}
          >
            {getCategoryLabel(cat)}
            <span className="ml-1.5 opacity-60 text-xs">
              (
              {cat === 'SEMUA'
                ? items.length
                : items.filter((i) => i.category === cat).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Grid Photos */}
      {filteredItems.length === 0 ? (
        <div className="card p-12 text-center">
          <Images size={36} className="text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Tidak ada foto di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              onClick={() => setSelectedIndex(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100 border border-slate-200 aspect-square shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Hover overlay with zoom icon — Academic Green & Gold */}
              <div className="absolute inset-0 bg-linear-to-t from-[#164325]/90 via-[#1E5631]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="self-end p-1.5 rounded-full bg-white/25 backdrop-blur-xs">
                  <MagnifyingGlassPlus size={18} weight="bold" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-[#1E5631]/90 px-2 py-0.5 rounded">
                    {getCategoryLabel(item.category)}
                  </span>
                  <p className="text-xs font-bold leading-snug line-clamp-1 mt-1 text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal — Harmonious Forest Backdrop & Pure White Card */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#164325]/80 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setSelectedIndex(null)}
            />

            {/* Modal Container — Pure White Card (#FFFFFF) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl bg-white border border-[#1E5631]/20 shadow-2xl overflow-hidden text-[#1E293B]"
            >
              {/* Top Bar — Academic Green (#1E5631) */}
              <div className="flex items-center justify-between p-4 border-b border-[#164325] bg-[#1E5631] text-white">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/15 border border-white/25 px-2.5 py-0.5 rounded-full">
                    {getCategoryLabel(selectedItem.category)}
                  </span>
                  <span className="text-xs text-emerald-100 font-mono">
                    {selectedIndex !== null ? selectedIndex + 1 : 0} / {filteredItems.length}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedIndex(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Tutup foto"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* Main Image Area — Clean Background */}
              <div className="relative flex-1 min-h-[50vh] sm:min-h-[60vh] bg-slate-900/10 flex items-center justify-center">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />

                {/* Nav buttons — Academic Green */}
                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#1E5631]/80 hover:bg-[#1E5631] text-white border border-white/20 transition-colors shadow-md"
                      aria-label="Foto sebelumnya"
                    >
                      <CaretLeft size={22} weight="bold" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#1E5631]/80 hover:bg-[#1E5631] text-white border border-white/20 transition-colors shadow-md"
                      aria-label="Foto selanjutnya"
                    >
                      <CaretRight size={22} weight="bold" />
                    </button>
                  </>
                )}
              </div>

              {/* Caption Footer — Pure White (#FFFFFF) & Academic Green Title */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#1E5631] leading-snug">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="text-xs sm:text-sm text-[#1E293B]/80 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
