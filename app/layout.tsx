import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from './providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SMPN 5 Cibeber — Sekolah Menengah Pertama Negeri 5 Cibeber',
    template: '%s | SMPN 5 Cibeber',
  },
  description:
    'Website resmi SMPN 5 Cibeber, Kabupaten Cianjur, Jawa Barat. Informasi sekolah, berita, profil, fasilitas, galeri, prestasi, dan PPDB.',
  keywords: ['SMPN 5 Cibeber', 'SMP Negeri 5 Cibeber', 'Cianjur', 'sekolah', 'pendidikan'],
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body
        className={`${jakarta.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
