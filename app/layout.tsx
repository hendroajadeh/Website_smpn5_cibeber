import type { Metadata } from 'next';
import { Outfit, Geist_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SMPN 5 Cibeber — Sekolah Menengah Pertama Negeri 5 Cibeber',
    template: '%s | SMPN 5 Cibeber',
  },
  description:
    'Website resmi SMPN 5 Cibeber, Kabupaten Lebak, Provinsi Banten. Informasi sekolah, berita, profil, fasilitas, galeri, prestasi, dan PPDB.',
  keywords: ['SMPN 5 Cibeber', 'SMP Negeri 5 Cibeber', 'Lebak', 'Banten', 'sekolah', 'pendidikan'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SMPN 5 Cibeber',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" style={{ colorScheme: 'light' }}>
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] text-[#1E293B]`}
      >
        {children}
      </body>
    </html>
  );
}
