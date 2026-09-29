'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ArticleSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { uploadImage } from '@/lib/upload';
import type { ActionResult } from '@/lib/utils';

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function createArticle(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAuth();

  const imageFile = formData.get('image') as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'articles');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const title = formData.get('title') as string;
  const raw = {
    title,
    slug: formData.get('slug') as string || slugify(title),
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    imageUrl,
    published: formData.get('published') === 'true',
    publishedAt: formData.get('published') === 'true' ? new Date().toISOString() : null,
  };

  const parsed = ArticleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Check slug uniqueness
  const existing = await db.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: 'Slug sudah digunakan, gunakan slug lain' };
  }

  const article = await db.article.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    },
  });

  revalidatePath('/berita');
  revalidatePath('/admin/berita');
  revalidatePath('/');

  return { success: true, data: { id: article.id }, message: 'Berita berhasil dibuat' };
}

export async function updateArticle(id: string, formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Berita tidak ditemukan' };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, 'articles');
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const title = formData.get('title') as string;
  const raw = {
    title,
    slug: formData.get('slug') as string || slugify(title),
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    imageUrl,
    published: formData.get('published') === 'true',
    publishedAt: formData.get('published') === 'true'
      ? (existing.publishedAt?.toISOString() ?? new Date().toISOString())
      : null,
  };

  const parsed = ArticleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Check slug uniqueness (excluding current)
  const slugConflict = await db.article.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (slugConflict) {
    return { success: false, error: 'Slug sudah digunakan oleh berita lain' };
  }

  await db.article.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    },
  });

  revalidatePath('/berita');
  revalidatePath(`/berita/${parsed.data.slug}`);
  revalidatePath('/admin/berita');
  revalidatePath('/');

  return { success: true, message: 'Berita berhasil diperbarui' };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  await requireAuth();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) return { success: false, error: 'Berita tidak ditemukan' };

  await db.article.delete({ where: { id } });

  revalidatePath('/berita');
  revalidatePath('/admin/berita');
  revalidatePath('/');

  return { success: true, message: 'Berita berhasil dihapus' };
}

export async function toggleArticlePublish(id: string): Promise<ActionResult> {
  await requireAuth();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) return { success: false, error: 'Berita tidak ditemukan' };

  const newPublished = !article.published;
  await db.article.update({
    where: { id },
    data: {
      published: newPublished,
      publishedAt: newPublished && !article.publishedAt ? new Date() : article.publishedAt,
    },
  });

  revalidatePath('/berita');
  revalidatePath('/admin/berita');
  revalidatePath('/');

  return { success: true, message: newPublished ? 'Berita dipublikasikan' : 'Berita disembunyikan' };
}
