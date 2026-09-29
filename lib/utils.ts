export type ActionResult<T = undefined> = 
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '…';
}

export function getLevelBadge(level: string): { label: string; class: string } {
  const map: Record<string, { label: string; class: string }> = {
    SEKOLAH: { label: 'Tingkat Sekolah', class: 'badge-gray' },
    KECAMATAN: { label: 'Tingkat Kecamatan', class: 'badge-gold' },
    KOTA: { label: 'Tingkat Kab/Kota', class: 'badge-gold' },
    PROVINSI: { label: 'Tingkat Provinsi', class: 'badge-gold' },
    NASIONAL: { label: 'Tingkat Nasional', class: 'badge-gold' },
    INTERNASIONAL: { label: 'Tingkat Internasional', class: 'badge-gold' },
  };
  return map[level] ?? { label: level, class: 'badge-gold' };
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    UMUM: 'Umum',
    PRESTASI: 'Prestasi',
    KEGIATAN: 'Kegiatan',
    FASILITAS: 'Fasilitas',
    AKADEMIK: 'Akademik',
    OLAHRAGA: 'Olahraga',
    SENI: 'Seni',
    IBADAH: 'Ibadah',
    KESEHATAN: 'Kesehatan',
    PENDUKUNG: 'Pendukung',
  };
  return map[category] ?? category;
}
