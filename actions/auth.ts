'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { setSession, clearSession, getSession } from '@/lib/auth';
import { LoginSchema } from '@/lib/validations';
import type { ActionResult } from '@/lib/utils';

export async function loginAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: 'Email atau password salah' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: 'Email atau password salah' };
  }

  await setSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/admin/login');
}

export async function getCurrentUser() {
  return getSession();
}
