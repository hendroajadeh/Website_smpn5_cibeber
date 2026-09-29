'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { StaffSchema, SettingSchema } from '@/lib/validations';
import { uploadImage } from '@/lib/upload';
import type { ActionResult } from '@/lib/utils';

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
}

// ================================
// STAFF ACTIONS
// ================================
export async function createStaff(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'staff');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const email = formData.get('email') as string;
  const raw = {
    name: formData.get('name') as string,
    position: formData.get('position') as string,
    level: parseInt(formData.get('level') as string || '3'),
    order: parseInt(formData.get('order') as string || '0'),
    imageUrl,
    nip: formData.get('nip') as string || null,
    education: formData.get('education') as string || null,
    email: email || null,
    active: formData.get('active') === 'true',
  };

  const parsed = StaffSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const staff = await db.staff.create({ data: parsed.data });
  revalidatePath('/profil');
  revalidatePath('/admin/profil');

  return { success: true, data: { id: staff.id }, message: 'Staff berhasil ditambahkan' };
}

export async function updateStaff(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const existing = await db.staff.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Staff tidak ditemukan' };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'staff');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const email = formData.get('email') as string;
  const raw = {
    name: formData.get('name') as string,
    position: formData.get('position') as string,
    level: parseInt(formData.get('level') as string || '3'),
    order: parseInt(formData.get('order') as string || '0'),
    imageUrl,
    nip: formData.get('nip') as string || null,
    education: formData.get('education') as string || null,
    email: email || null,
    active: formData.get('active') === 'true',
  };

  const parsed = StaffSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.staff.update({ where: { id }, data: parsed.data });
  revalidatePath('/profil');
  revalidatePath('/admin/profil');

  return { success: true, message: 'Staff berhasil diperbarui' };
}

export async function deleteStaff(id: string): Promise<ActionResult> {
  await requireAuth();
  await db.staff.delete({ where: { id } });
  revalidatePath('/profil');
  revalidatePath('/admin/profil');
  return { success: true, message: 'Staff berhasil dihapus' };
}

// ================================
// SETTINGS ACTIONS
// ================================
export async function updateSettings(formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const entries = Array.from(formData.entries());
  const errors: string[] = [];

  for (const [key, value] of entries) {
    if (!key) continue;

    let finalValue: string;

    if (value instanceof File) {
      if (value.size === 0) continue; // Skip empty files
      const result = await uploadImage(value, 'settings');
      if (result.error) {
        errors.push(`Gagal upload ${key}: ${result.error}`);
        continue;
      }
      finalValue = result.url;
    } else if (typeof value === 'string') {
      finalValue = value;
    } else {
      continue;
    }

    const parsed = SettingSchema.safeParse({ key, value: finalValue });
    if (!parsed.success) {
      errors.push(`Key "${key}" tidak valid`);
      continue;
    }

    await db.setting.upsert({
      where: { key },
      update: { value: finalValue },
      create: { key, value: finalValue, group: 'GENERAL' },
    });
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join(', ') };
  }

  revalidatePath('/');
  revalidatePath('/kontak');
  revalidatePath('/ppdb');
  revalidatePath('/profil');
  revalidatePath('/prestasi');
  revalidatePath('/admin/beranda');
  revalidatePath('/admin/pengaturan');
  revalidatePath('/admin/profil');

  return { success: true, message: 'Pengaturan berhasil disimpan' };
}

export async function updateSingleSetting(key: string, value: string): Promise<ActionResult> {
  await requireAuth();

  await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value, group: 'GENERAL' },
  });

  revalidatePath('/');
  revalidatePath('/admin/pengaturan');

  return { success: true, message: 'Pengaturan berhasil disimpan' };
}
