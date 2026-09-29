'use client';

import { useState } from 'react';
import { CaretDown, Question } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';

const faqs = [
  {
    q: 'Kapan jadwal pendaftaran siswa baru (PPDB) SMPN 5 Cibeber dibuka?',
    a: 'Pendaftaran PPDB SMPN 5 Cibeber tahun ajaran 2025/2026 dibuka mulai tanggal 1 Juni 2025 hingga 30 Juni 2025 secara daring/luring. Pengumuman hasil seleksi dijadwalkan pada 5 Juli 2025.',
  },
  {
    q: 'Jalur apa saja yang dibuka untuk penerimaan siswa baru?',
    a: 'Terdapat 4 jalur resmi: (1) Jalur Zonasi dengan kuota 50% berdasarkan jarak tempat tinggal, (2) Jalur Afirmasi 15% untuk keluarga ekonomi kurang mampu/disabilitas, (3) Jalur Perpindahan Tugas Orang Tua 5%, dan (4) Jalur Prestasi 30% berdasarkan nilai rapor dan sertifikat kejuaraan.',
  },
  {
    q: 'Apakah ada pungutan biaya pendaftaran atau uang gedung?',
    a: 'Tidak ada. Sebagai Sekolah Menengah Pertama Negeri, seluruh proses pendaftaran PPDB di SMPN 5 Cibeber tidak dipungut biaya apa pun (Gratis), didukung penuh oleh Dana Bantuan Operasional Sekolah (BOS).',
  },
  {
    q: 'Berkas apa saja yang wajib disiapkan calon peserta didik?',
    a: 'Berkas utama mencakup: Fotokopi Akta Kelahiran, Fotokopi Kartu Keluarga (KK minimal 1 tahun), Ijazah SD/Surat Keterangan Lulus (SKL), Pas Foto 3x4 (3 lembar), serta fotokopi sertifikat/piagam prestasi (khusus jalur prestasi) atau KIP/PKH (khusus jalur afirmasi).',
  },
  {
    q: 'Apa saja fasilitas pendukung dan kegiatan ekstrakurikuler yang ada?',
    a: 'Fasilitas meliputi Laboratorium Komputer ber-AC, Perpustakaan, Lapangan Olahraga multifungsi, Musala, dan Ruang UKS. Ekstrakurikuler aktif meliputi Pramuka (wajib), PMR, Paskibra, Futsal, Bola Voli, Seni Tari Tradisional, Marawis, dan English Club.',
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] border-t border-slate-200/80">
      {/* Siluet Batik Mega Mendung */}
      <MegaMendungPattern opacity="opacity-[0.13]" />

      <div className="container-site max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5631] tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-[#1E293B]/70 max-w-xl mx-auto">
            Informasi penting dan jawaban atas pertanyaan umum dari orang tua serta calon peserta didik baru.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card overflow-hidden border border-slate-200 bg-white transition-colors shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#1E293B] leading-snug">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-slate-400"
                  >
                    <CaretDown size={18} weight="bold" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#1E293B]/80 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
