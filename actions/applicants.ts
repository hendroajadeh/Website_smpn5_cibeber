'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateApplicantStatus(id: string, status: string) {
  try {
    await db.ppdbApplicant.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/ppdb');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
