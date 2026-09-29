import { db } from '@/lib/db';
import { Phone, Envelope, MapPin, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Informasi kontak, alamat, dan peta lokasi SMPN 5 Cibeber.',
};

async function getContactSettings() {
  const settings = await db.setting.findMany({
    where: {
      key: {
        in: ['school_name', 'school_address', 'school_phone', 'school_email', 'school_whatsapp', 'maps_embed_url'],
      },
    },
  });
  return Object.fromEntries(settings.map((x) => [x.key, x.value]));
}

export default async function KontakPage() {
  const settings = await getContactSettings();

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Kontak</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Informasi kontak dan lokasi {settings.school_name ?? 'SMPN 5 Cibeber'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 dark:text-zinc-100">Informasi Kontak</h2>

              <div className="space-y-4">
                {settings.school_address && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-[#1e3a8a] dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-0.5">Alamat</p>
                      <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">{settings.school_address}</p>
                    </div>
                  </div>
                )}

                {settings.school_phone && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-[#1e3a8a] dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-0.5">Telepon</p>
                      <a href={`tel:${settings.school_phone}`} className="text-sm text-slate-700 dark:text-zinc-300 hover:text-[#1e3a8a] dark:hover:text-blue-300 transition-colors">
                        {settings.school_phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.school_email && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 flex items-center justify-center shrink-0">
                      <Envelope size={16} className="text-[#1e3a8a] dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-0.5">Email</p>
                      <a href={`mailto:${settings.school_email}`} className="text-sm text-slate-700 dark:text-zinc-300 hover:text-[#1e3a8a] dark:hover:text-blue-300 transition-colors">
                        {settings.school_email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {settings.school_whatsapp && (
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <a
                    href={`https://wa.me/${settings.school_whatsapp}?text=Halo, saya ingin bertanya mengenai SMPN 5 Cibeber.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full justify-center"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Hubungi via WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Google Maps */}
          <div className="card overflow-hidden p-0">
            {settings.maps_embed_url ? (
              <iframe
                src={settings.maps_embed_url}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi SMPN 5 Cibeber"
                className="w-full"
              />
            ) : (
              <div className="h-96 flex items-center justify-center bg-slate-50 dark:bg-zinc-800">
                <div className="text-center space-y-2">
                  <MapPin size={36} className="text-slate-300 dark:text-zinc-600 mx-auto" />
                  <p className="text-sm text-slate-400 dark:text-zinc-500">Peta belum dikonfigurasi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
