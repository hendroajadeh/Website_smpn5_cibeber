import { db } from '@/lib/db';
import Link from 'next/link';
import {
  Newspaper,
  Images,
  Buildings,
  Trophy,
  Users,
  UsersFour,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

async function getDashboardStats() {
  const [articles, galleries, facilities, achievements, staff, ppdbSteps, latestArticles] =
    await Promise.all([
      db.article.count(),
      db.gallery.count(),
      db.facility.count(),
      db.achievement.count(),
      db.staff.count(),
      db.ppdbStep.count(),
      db.article.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, published: true, createdAt: true } }),
    ]);
  return { articles, galleries, facilities, achievements, staff, ppdbSteps, latestArticles };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Berita', value: stats.articles, icon: Newspaper, href: '/admin/berita', color: 'text-[#1e3a8a]', bg: 'bg-[#1e3a8a]/10' },
    { label: 'Galeri', value: stats.galleries, icon: Images, href: '/admin/galeri', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fasilitas', value: stats.facilities, icon: Buildings, href: '/admin/fasilitas', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Prestasi', value: stats.achievements, icon: Trophy, href: '/admin/prestasi', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Staff', value: stats.staff, icon: Users, href: '/admin/profil', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Langkah PPDB', value: stats.ppdbSteps, icon: UsersFour, href: '/admin/ppdb', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Ringkasan konten website SMPN 5 Cibeber</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card p-4 space-y-3 hover:border-slate-300 transition-colors">
            <div className={`h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon size={18} className={card.color} weight="duotone" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">{card.value}</p>
              <p className="text-[11px] text-slate-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Berita Terbaru</h2>
          <Link href="/admin/berita" className="btn btn-secondary btn-sm">
            Kelola
            <ArrowRight size={13} />
          </Link>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestArticles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-slate-400 py-8">Belum ada berita</td>
                </tr>
              ) : (
                stats.latestArticles.map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium text-slate-900 max-w-xs truncate">{a.title}</td>
                    <td>
                      <span className={`badge ${a.published ? 'badge-success' : 'badge-gray'}`}>
                        {a.published ? 'Publik' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-slate-400 font-mono text-xs whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
