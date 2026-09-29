import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
          'school_name_short',
          'school_address',
          'school_phone',
          'school_email',
          'school_whatsapp',
          'school_accreditation',
          'school_npsn',
          'school_badge_text',
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
  const settings = await getLayoutSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="min-h-[calc(100dvh-4rem)] pt-[100px] sm:pt-[116px]">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
