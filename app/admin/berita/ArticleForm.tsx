'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Article } from '@prisma/client';
import { ArrowLeft } from '@phosphor-icons/react';
import { createArticle, updateArticle } from '@/actions/articles';
import { slugify } from '@/lib/utils';

type Props = {
  article: Article | null;
  onSuccess: () => void;
  onCancel: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
};

export default function ArticleForm({ article, onSuccess, onCancel, showToast }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [title, setTitle] = useState(article?.title ?? '');
  const [published, setPublished] = useState(article?.published ?? false);
  const [previewImage, setPreviewImage] = useState<string | null>(article?.imageUrl ?? null);

  useEffect(() => {
    if (!article) {
      setSlug(slugify(title));
    }
  }, [title, article]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    formData.set('slug', slug);
    formData.set('published', published ? 'true' : 'false');

    startTransition(async () => {
      const result = article
        ? await updateArticle(article.id, formData)
        : await createArticle(formData);

      if (result.success) {
        showToast(result.message ?? 'Berhasil', 'success');
        onSuccess();
      } else {
        showToast(result.error, 'error');
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="btn btn-ghost btn-sm">
          <ArrowLeft size={15} />
          Kembali
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {article ? 'Edit Berita' : 'Tambah Berita'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="label label-required">Judul Berita</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="Masukkan judul berita"
                disabled={isPending}
              />
              {errors.title && <p className="form-error">{errors.title[0]}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="slug" className="label label-required">Slug URL</label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`input font-mono text-sm ${errors.slug ? 'input-error' : ''}`}
                placeholder="slug-berita-anda"
                disabled={isPending}
              />
              <p className="form-hint">URL: /berita/{slug || 'slug-berita'}</p>
              {errors.slug && <p className="form-error">{errors.slug[0]}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="excerpt" className="label label-required">Ringkasan</label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                defaultValue={article?.excerpt}
                className={`input ${errors.excerpt ? 'input-error' : ''}`}
                placeholder="Ringkasan singkat berita (tampil di list)"
                disabled={isPending}
              />
              {errors.excerpt && <p className="form-error">{errors.excerpt[0]}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="content" className="label label-required">Konten</label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                defaultValue={article?.content}
                className={`input font-mono text-sm ${errors.content ? 'input-error' : ''}`}
                placeholder="Tulis konten berita di sini. Anda bisa menggunakan HTML dasar seperti <p>, <h2>, <ul>, <strong>"
                disabled={isPending}
              />
              {errors.content && <p className="form-error">{errors.content[0]}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish settings */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Publikasi</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  disabled={isPending}
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${published ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${published ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {published ? 'Dipublikasikan' : 'Draft'}
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="btn btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary flex-1"
              >
                {isPending ? (
                  <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Image upload */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Gambar Utama</h3>
            {previewImage && (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100">
                <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="image" className="label">
                {previewImage ? 'Ganti Gambar' : 'Pilih Gambar'}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="input text-xs"
                disabled={isPending}
              />
              <p className="form-hint">JPG, PNG, WebP. Maks. 2MB</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
