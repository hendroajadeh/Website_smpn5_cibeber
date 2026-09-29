import { z } from 'zod';

// ================================
// AUTH
// ================================
export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

// ================================
// ARTICLE / NEWS
// ================================
export const ArticleSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').max(200).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  excerpt: z.string().min(10, 'Ringkasan minimal 10 karakter').max(500, 'Ringkasan maksimal 500 karakter'),
  content: z.string().min(20, 'Konten minimal 20 karakter'),
  imageUrl: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;

// ================================
// STAFF
// ================================
export const StaffSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  position: z.string().min(2, 'Jabatan minimal 2 karakter').max(200),
  level: z.number().int().min(1).max(3),
  order: z.number().int().min(0).default(0),
  imageUrl: z.string().optional().nullable(),
  nip: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  email: z.string().email('Email tidak valid').optional().nullable().or(z.literal('')),
  active: z.boolean().default(true),
});

export type StaffInput = z.infer<typeof StaffSchema>;

// ================================
// GALLERY
// ================================
export const GallerySchema = z.object({
  title: z.string().min(2, 'Judul minimal 2 karakter').max(200),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Gambar wajib diunggah'),
  category: z.enum(['UMUM', 'PRESTASI', 'KEGIATAN', 'FASILITAS']).default('UMUM'),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type GalleryInput = z.infer<typeof GallerySchema>;

// ================================
// FACILITY
// ================================
export const FacilitySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(200),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  category: z.string().min(1, 'Kategori wajib dipilih').max(100),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type FacilityInput = z.infer<typeof FacilitySchema>;

// ================================
// ACHIEVEMENT
// ================================
export const AchievementSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200),
  description: z.string().optional().nullable(),
  level: z.enum(['SEKOLAH', 'KECAMATAN', 'KOTA', 'PROVINSI', 'NASIONAL', 'INTERNASIONAL']),
  year: z.number().int().min(2000).max(2100),
  imageUrl: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type AchievementInput = z.infer<typeof AchievementSchema>;

// ================================
// PPDB STEP
// ================================
export const PpdbStepSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(100),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(500),
  icon: z.string().min(1).max(50).default('file-text'),
  stepOrder: z.number().int().min(1),
  active: z.boolean().default(true),
});

export type PpdbStepInput = z.infer<typeof PpdbStepSchema>;

// ================================
// SETTINGS
// ================================
export const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const SettingsGroupSchema = z.record(z.string(), z.string());

// ================================
// IMAGE UPLOAD
// ================================
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return 'Format gambar harus JPG, PNG, atau WebP';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 2MB';
  }
  return null;
}
