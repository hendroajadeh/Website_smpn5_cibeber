import Image from 'next/image';
import { db } from '@/lib/db';
import { Phone, Envelope, MapPin, WhatsappLogo, Clock, ChatTeardropText } from '@phosphor-icons/react/dist/ssr';
import ContactForm from '@/components/ui/ContactForm';
import MegaMendungPattern from '@/components/ui/MegaMendungPattern';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi Sekolah',
  description: 'Alamat lengkap, peta lokasi Google Maps, kontak WhatsApp, email, dan formulir pengaduan SMPN 5 Cibeber.',
};

async function getContactSettings() {
  const settings = await db.setting.findMany({
    where: {
      key: {
        in: [
          'school_name',
          'school_address',
          'school_phone',
          'school_email',
          'school_whatsapp',
          'maps_embed_url',
        ],
      },
    },
  });
  return Object.fromEntries(settings.map((x) => [x.key, x.value]));
}

export default async function KontakPage() {
  const settings = await getContactSettings();

  return (
    <div>
      {/* Hero Banner Kontak — Background Foto Fasad Gedung dengan Tint Hijau Lembut */}
      <section className="relative overflow-hidden text-white py-16 md:py-20 border-b border-emerald-950/20">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/gedung-smpn5cibeber.jpg"
            alt="Gedung SMP Negeri 5 Cibeber"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Lapisan Hijau Diturunkan Opasitasnya agar Foto Gedung Terlihat Jelas */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E5631]/78 via-[#1E5631]/65 to-[#143e22]/88" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1E5631]/20 to-emerald-950/55" />
        </div>

        <div className="container-site relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-amber-300 shadow-sm">
            <ChatTeardropText size={16} weight="fill" />
            <span>Hubungi &amp; Kunjungi Sekolah</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Kontak &amp; Lokasi Sekolah
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            Kami siap melayani kebutuhan informasi seputar pendaftaran siswa baru, administrasi sekolah, dan kerjasama pendidikan di SMPN 5 Cibeber, Kabupaten Lebak, Banten.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-xs">
              Layanan Cepat via WhatsApp
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 font-semibold shadow-xs">
              Buka Senin – Jumat
            </span>
          </div>
        </div>
      </section>

      {/* Formulir Kontak & Peta dengan Siluet Batik Mega Mendung */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
        {/* Siluet Batik Mega Mendung Khas Jawa Barat */}
        <MegaMendungPattern opacity="opacity-[0.13]" />

        <div className="container-site relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
            {/* Kolom Kiri: Form Kirim Pesan (7 Kolom) */}
            <div className="lg:col-span-7">
              <ContactForm whatsappNumber={settings.school_whatsapp} />
            </div>

            {/* Kolom Kanan: Info Kontak Detail (5 Kolom) - Pure White Card */}
            <div className="lg:col-span-5 space-y-5">
              <div className="card p-6 sm:p-7 space-y-5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm">
                <h2 className="text-base font-bold text-[#1E5631] pb-2 border-b border-slate-100">
                  Informasi Layanan &amp; Kontak Resmi
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Alamat */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                      <MapPin size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Alamat Sekolah
                      </p>
                      <p className="text-[#1E293B] leading-relaxed font-medium">
                        {settings.school_address ?? 'Kecamatan Cibeber, Kabupaten Lebak, Provinsi Banten'}
                      </p>
                    </div>
                  </div>

                  {/* Telepon */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                      <Phone size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Telepon Kantor
                      </p>
                      <a
                        href={`tel:${settings.school_phone}`}
                        className="text-[#1E293B] hover:text-[#1E5631] font-semibold transition-colors"
                      >
                        {settings.school_phone ?? '-'}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                      <Envelope size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Email Resmi
                      </p>
                      <a
                        href={`mailto:${settings.school_email}`}
                        className="text-[#1E293B] hover:text-[#1E5631] font-semibold break-all transition-colors"
                      >
                        {settings.school_email ?? '-'}
                      </a>
                    </div>
                  </div>

                  {/* Jam Pelayanan */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#1E5631]/10 text-[#1E5631] flex items-center justify-center shrink-0">
                      <Clock size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Jam Kerja Pelayanan TU
                      </p>
                      <p className="text-[#1E293B] leading-snug">
                        Senin – Kamis: 07.30 – 15.00 WIB
                        <br />
                        Jumat: 07.30 – 11.30 WIB
                      </p>
                    </div>
                  </div>
                </div>

                {settings.school_whatsapp && (
                  <div className="pt-3 border-t border-slate-100">
                    <a
                      href={`https://wa.me/${settings.school_whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20SMPN%205%20Cibeber,%20saya%20ingin%20bertanya%20informasi%20sekolah.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 bg-[#1E5631] hover:bg-[#164325] border-none text-white font-bold transition-all duration-200"
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <span>Chat WhatsApp Cepat</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Peta Google Maps Interaktif */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1E5631]">Peta Lokasi Sekolah</h2>
                <p className="text-xs text-[#1E293B]/70">Petunjuk rute menuju sekolah SMPN 5 Cibeber</p>
              </div>
              {settings.maps_embed_url && (
                <a
                  href={settings.maps_embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Buka di Google Maps
                </a>
              )}
            </div>

            <div className="card overflow-hidden p-0 rounded-2xl border border-slate-200/90 shadow-sm bg-white">
              {settings.maps_embed_url ? (
                <iframe
                  src={settings.maps_embed_url}
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi SMPN 5 Cibeber"
                  className="w-full"
                />
              ) : (
                <div className="h-80 flex items-center justify-center bg-slate-50">
                  <div className="text-center space-y-2">
                    <MapPin size={36} className="text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-400">Peta belum dikonfigurasi</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
