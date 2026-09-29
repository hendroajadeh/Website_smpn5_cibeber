'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { GallerySchema, FacilitySchema, AchievementSchema, PpdbStepSchema } from '@/lib/validations';
import { uploadImage } from '@/lib/upload';
import type { ActionResult } from '@/lib/utils';

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

// ================================
// GALLERY ACTIONS
// ================================
export async function createGallery(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  const imageFile = formData.get('image') as File | null;
  let imageUrl = '';

  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'galleries');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    imageUrl,
    category: formData.get('category') as string || 'UMUM',
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = GallerySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const gallery = await db.gallery.create({ data: parsed.data });
  revalidatePath('/galeri');
  revalidatePath('/admin/galeri');

  return { success: true, data: { id: gallery.id }, message: 'Item galeri berhasil ditambahkan' };
}

export async function updateGallery(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const existing = await db.gallery.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Item tidak ditemukan' };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'galleries');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    imageUrl,
    category: formData.get('category') as string || 'UMUM',
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = GallerySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.gallery.update({ where: { id }, data: parsed.data });
  revalidatePath('/galeri');
  revalidatePath('/admin/galeri');

  return { success: true, message: 'Item galeri berhasil diperbarui' };
}

export async function deleteGallery(id: string): Promise<ActionResult> {
  await requireAuth();
  await db.gallery.delete({ where: { id } });
  revalidatePath('/galeri');
  revalidatePath('/admin/galeri');
  return { success: true, message: 'Item galeri berhasil dihapus' };
}

// ================================
// FACILITY ACTIONS
// ================================
export async function createFacility(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'facilities');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    imageUrl,
    category: formData.get('category') as string || 'UMUM',
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = FacilitySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const facility = await db.facility.create({ data: parsed.data });
  revalidatePath('/fasilitas');
  revalidatePath('/admin/fasilitas');

  return { success: true, data: { id: facility.id }, message: 'Fasilitas berhasil ditambahkan' };
}

export async function updateFacility(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const existing = await db.facility.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Fasilitas tidak ditemukan' };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'facilities');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    imageUrl,
    category: formData.get('category') as string || 'UMUM',
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = FacilitySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.facility.update({ where: { id }, data: parsed.data });
  revalidatePath('/fasilitas');
  revalidatePath('/admin/fasilitas');

  return { success: true, message: 'Fasilitas berhasil diperbarui' };
}

export async function deleteFacility(id: string): Promise<ActionResult> {
  await requireAuth();
  await db.facility.delete({ where: { id } });
  revalidatePath('/fasilitas');
  revalidatePath('/admin/fasilitas');
  return { success: true, message: 'Fasilitas berhasil dihapus' };
}

// ================================
// ACHIEVEMENT ACTIONS
// ================================
export async function createAchievement(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'achievements');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    level: formData.get('level') as string,
    year: parseInt(formData.get('year') as string),
    imageUrl,
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = AchievementSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const achievement = await db.achievement.create({ data: parsed.data });
  revalidatePath('/prestasi');
  revalidatePath('/admin/prestasi');

  return { success: true, data: { id: achievement.id }, message: 'Prestasi berhasil ditambahkan' };
}

export async function updateAchievement(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const existing = await db.achievement.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Prestasi tidak ditemukan' };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'achievements');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    level: formData.get('level') as string,
    year: parseInt(formData.get('year') as string),
    imageUrl,
    order: parseInt(formData.get('order') as string || '0'),
    active: formData.get('active') === 'true',
  };

  const parsed = AchievementSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.achievement.update({ where: { id }, data: parsed.data });
  revalidatePath('/prestasi');
  revalidatePath('/admin/prestasi');

  return { success: true, message: 'Prestasi berhasil diperbarui' };
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  await requireAuth();
  await db.achievement.delete({ where: { id } });
  revalidatePath('/prestasi');
  revalidatePath('/admin/prestasi');
  return { success: true, message: 'Prestasi berhasil dihapus' };
}

// ================================
// PPDB ACTIONS
// ================================
export async function createPpdbStep(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    icon: formData.get('icon') as string || 'file-text',
    stepOrder: parseInt(formData.get('stepOrder') as string),
    active: formData.get('active') === 'true',
  };

  const parsed = PpdbStepSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const step = await db.ppdbStep.create({ data: parsed.data });
  revalidatePath('/ppdb');
  revalidatePath('/admin/ppdb');

  return { success: true, data: { id: step.id }, message: 'Langkah PPDB berhasil ditambahkan' };
}

export async function updatePpdbStep(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    icon: formData.get('icon') as string || 'file-text',
    stepOrder: parseInt(formData.get('stepOrder') as string),
    active: formData.get('active') === 'true',
  };

  const parsed = PpdbStepSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.ppdbStep.update({ where: { id }, data: parsed.data });
  revalidatePath('/ppdb');
  revalidatePath('/admin/ppdb');

  return { success: true, message: 'Langkah PPDB berhasil diperbarui' };
}

export async function deletePpdbStep(id: string): Promise<ActionResult> {
  await requireAuth();
  await db.ppdbStep.delete({ where: { id } });
  revalidatePath('/ppdb');
  revalidatePath('/admin/ppdb');
  return { success: true, message: 'Langkah PPDB berhasil dihapus' };
}
