import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Admin | SMPN 5 Cibeber',
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
