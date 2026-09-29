'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Article } from '@prisma/client';
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
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Kembali
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {article ? 'Edit Artikel Berita' : 'Tulis Artikel Baru'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-700 mb-1.5">Judul Berita</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Masukkan judul berita"
                disabled={isPending}
              />
              {errors.title && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.title[0]}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-bold text-slate-700 mb-1.5">Slug URL</label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 font-mono ${errors.slug ? 'border-red-500' : ''}`}
                placeholder="slug-berita-anda"
                disabled={isPending}
              />
              <p className="text-[10px] text-slate-500 mt-1">URL: /berita/{slug || 'slug-berita'}</p>
              {errors.slug && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.slug[0]}</p>}
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-xs font-bold text-slate-700 mb-1.5">Ringkasan</label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                defaultValue={article?.excerpt}
                className={`w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 ${errors.excerpt ? 'border-red-500' : ''}`}
                placeholder="Ringkasan singkat berita (tampil di list)"
                disabled={isPending}
              />
              {errors.excerpt && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.excerpt[0]}</p>}
            </div>

            <div>
              <label htmlFor="content" className="block text-xs font-bold text-slate-700 mb-1.5">Konten Berita</label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                defaultValue={article?.content}
                className={`w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500 font-mono ${errors.content ? 'border-red-500' : ''}`}
                placeholder="Tulis konten berita di sini (Mendukung HTML dasar seperti <p>, <h2>, <ul>, <strong>)"
                disabled={isPending}
              />
              {errors.content && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.content[0]}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Publikasi</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  disabled={isPending}
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${published ? 'bg-teal-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${published ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {published ? 'Terpublikasi (Public)' : 'Simpan sebagai Draft'}
              </span>
            </label>

            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {isPending && <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isPending ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Batal
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Gambar Utama</h3>
            {previewImage && (
              <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
            <div>
              <label htmlFor="image" className="block text-xs font-bold text-slate-700 mb-1.5">
                {previewImage ? 'Ganti Gambar' : 'Pilih Gambar'}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-teal-500"
                disabled={isPending}
              />
              <p className="text-[10px] text-slate-500 mt-1.5">Mendukung JPG, PNG, WebP. Maks 2MB.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
