'use client';

import { useState } from 'react';
import { WhatsappLogo, X, ChatCircleDots, GraduationCap, Phone } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

type FloatingWhatsAppProps = {
  whatsapp?: string;
  phone?: string;
};

export default function FloatingWhatsApp({
  whatsapp = '6281234567890',
  phone = '(0266) 6321234',
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Bersihkan format nomor WA (hanya angka)
  const cleanWaNumber = (whatsapp || '6281234567890').replace(/[^0-9]/g, '');

  const ppdbMessage = encodeURIComponent(
    'Halo Panitia PPDB SMPN 5 Cibeber, saya ingin bertanya mengenai informasi pendaftaran siswa baru (PPDB).'
  );
  const generalMessage = encodeURIComponent(
    'Halo Admin SMPN 5 Cibeber, saya ingin bertanya mengenai informasi sekolah.'
  );

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-800"
          >
            {/* Header Popover — Academic Green & White */}
            <div className="bg-[#1E5631] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <WhatsappLogo size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight text-white">Layanan Informasi Sekolah</h4>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    SMPN 5 Cibeber &bull; Respon Cepat
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                aria-label="Tutup pesan bantuan"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 text-xs bg-slate-50/70">
              <p className="text-[#1E293B]/80 leading-relaxed">
                Silakan pilih topik bantuan untuk terhubung langsung dengan panitia atau tata usaha:
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Opsi 1: Pertanyaan PPDB */}
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${ppdbMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1E5631] hover:shadow-xs active:scale-97 transition-all duration-200 group"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                    <GraduationCap size={20} weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors">
                      Panitia PPDB 2025/2026
                    </p>
                    <p className="text-[11px] text-[#1E293B]/65 truncate">
                      Syarat jalur zonasi, kuota, berkas
                    </p>
                  </div>
                </a>

                {/* Opsi 2: Pertanyaan Umum / Tata Usaha */}
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${generalMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1E5631] hover:shadow-xs active:scale-97 transition-all duration-200 group"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                    <ChatCircleDots size={20} weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1E293B] group-hover:text-[#1E5631] transition-colors">
                      Pelayanan Tata Usaha (TU)
                    </p>
                    <p className="text-[11px] text-[#1E293B]/65 truncate">
                      Legalisir ijazah, surat keterangan, mutasi
                    </p>
                  </div>
                </a>
              </div>

              {phone && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#1E293B]/60">
                  <span>Telepon Kantor:</span>
                  <a
                    href={`tel:${phone}`}
                    className="font-semibold text-[#1E293B] hover:text-[#1E5631] flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Phone size={12} />
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.94, y: 1 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 h-13 px-5 rounded-full bg-[#1E5631] text-white shadow-lg shadow-[#1E5631]/30 hover:bg-[#164325] transition-colors focus:outline-none focus:ring-4 focus:ring-[#1E5631]/30 cursor-pointer"
        aria-label="Bantuan WhatsApp Sekolah"
      >
        <WhatsappLogo size={26} weight="fill" />
        <span className="text-xs sm:text-sm font-bold tracking-tight pr-1">
          {isOpen ? 'Tutup' : 'Chat Sekolah'}
        </span>
      </motion.button>
    </div>
  );
}
