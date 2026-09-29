import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './validations';

export async function uploadImage(
  file: File,
  folder: string = 'general'
): Promise<{ url: string; error?: string }> {
  // Type validation
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return { url: '', error: 'Format gambar harus JPG, PNG, atau WebP' };
  }

  // Size validation
  if (file.size > MAX_IMAGE_SIZE) {
    return { url: '', error: 'Ukuran gambar maksimal 2MB' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${nanoid(12)}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${folder}/${filename}`;
    return { url };
  } catch {
    return { url: '', error: 'Gagal mengunggah gambar. Coba lagi.' };
  }
}

export async function deleteImage(url: string): Promise<void> {
  if (!url || !url.startsWith('/uploads/')) return;
  try {
    const { unlink } = await import('fs/promises');
    const filepath = join(process.cwd(), 'public', url);
    await unlink(filepath);
  } catch {
    // Silently fail if file doesn't exist
  }
}
