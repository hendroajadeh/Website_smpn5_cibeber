'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  CaretLeft,
  CaretRight,
  ArrowRight,
} from '@phosphor-icons/react';

export interface AchievementItem {
  id: string;
  title: string;
  description: string | null;
  level: string;
  year: number;
  imageUrl: string | null;
}

interface AchievementCarouselProps {
  achievements: AchievementItem[];
}

export default function AchievementCarousel({
  achievements,
}: AchievementCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar dengan Judul & Tombol Kontrol Geser Kanan-Kiri */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Prestasi Gemilang Siswa
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Tombol Panah Geser Samping (Scroll Kiri & Kanan) */}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md p-1 rounded-xl border border-white/30 shadow-sm">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Geser ke kiri"
              className={`p-2 rounded-lg transition-all duration-200 ${
                canScrollLeft
                  ? 'bg-white text-[#1E5631] shadow-sm hover:bg-amber-400 hover:text-slate-900 active:scale-90 cursor-pointer'
                  : 'text-white/40 cursor-not-allowed'
              }`}
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Geser ke kanan"
              className={`p-2 rounded-lg transition-all duration-200 ${
                canScrollRight
                  ? 'bg-white text-[#1E5631] shadow-sm hover:bg-amber-400 hover:text-slate-900 active:scale-90 cursor-pointer'
                  : 'text-white/40 cursor-not-allowed'
              }`}
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>

          {/* Tautan Lihat Semua Halaman Prestasi */}
          <Link
            href="/prestasi"
            className="text-xs sm:text-sm font-bold text-amber-300 hover:text-white inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-sm hover:bg-white/30 transition-all"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>

      {/* Kontainer Scroll Samping Kanan (Horizontal Scroll Container) */}
      <div className="relative">

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-0.5 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="w-[280px] sm:w-[325px] shrink-0 snap-start overflow-hidden bg-white/95 backdrop-blur-md border border-white/90 shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group rounded-2xl"
            >
              {/* Thumbnail / Piala */}
              <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                {ach.imageUrl ? (
                  <Image
                    src={ach.imageUrl}
                    alt={ach.title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#eaf4ed] via-slate-100 to-amber-50/50 text-[#1E5631]">
                    <Trophy
                      size={44}
                      weight="duotone"
                      className="text-amber-500 drop-shadow-xs mb-1"
                    />
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                      Piagam Prestasi
                    </span>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#1E5631]/95 text-white text-[10px] font-bold shadow-xs">
                  Tahun {ach.year}
                </span>
              </div>

              {/* Konten Kartu */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-[#b45309] text-[10px] font-bold uppercase mb-2">
                    Tingkat {ach.level}
                  </span>
                  <h3 className="font-bold text-sm text-[#1E293B] group-hover:text-[#1E5631] transition-colors line-clamp-2 leading-snug">
                    {ach.title}
                  </h3>
                  {ach.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
