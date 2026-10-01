import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { db } from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMPN 5 Cibeber',
};

async function getLayoutSettings() {
  const settings = await db.setting.findMany({
    where: {
      key: {
        in: [
          'school_name',
          'school_address',
          'school_phone',
          'school_email',
          'school_whatsapp',
          'school_accreditation',
          'ppdb_year',
        ],
      },
    },
  });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutSettings = await getLayoutSettings();

  return (
    <>
      <Navbar settings={layoutSettings} />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
      <Footer settings={layoutSettings} />
      <FloatingWhatsApp
        whatsapp={layoutSettings.school_whatsapp}
        phone={layoutSettings.school_phone}
      />
    </>
  );
}
