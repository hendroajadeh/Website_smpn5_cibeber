'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/actions/auth';
import { GraduationCap, Eye, EyeSlash, SignIn } from '@phosphor-icons/react';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-[#1e3a8a] items-center justify-center mb-4 shadow-md">
            <GraduationCap size={28} weight="fill" className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Panel Admin
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">SMPN 5 Cibeber</p>
        </div>

        {/* Form */}
        <div className="card p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Masuk ke akun admin</h2>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-3">
              <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="label label-required">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@smpn5cibeber.sch.id"
                className="input"
                disabled={isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label label-required">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  className="input pr-10"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full justify-center"
            >
              {isPending ? (
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SignIn size={16} weight="bold" />
              )}
              {isPending ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-zinc-600 mt-6">
          Hanya untuk administrator sekolah yang berwenang.
        </p>
      </div>
    </div>
  );
}
