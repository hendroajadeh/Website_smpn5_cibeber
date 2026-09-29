'use client';

import { WarningCircle } from '@phosphor-icons/react';

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
};

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = 'Hapus',
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-sm shadow-lg space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <WarningCircle size={20} className="text-red-500" weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onCancel} disabled={loading} className="btn btn-secondary btn-sm">
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger btn-sm">
            {loading ? (
              <span className="inline-block h-3.5 w-3.5 border-2 border-red-300/40 border-t-red-600 rounded-full animate-spin" />
            ) : null}
            {loading ? 'Menghapus...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
