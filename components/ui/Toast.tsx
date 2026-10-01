'use client';

import { useEffect } from 'react';
import { X, CheckCircle, XCircle } from '@phosphor-icons/react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm w-full card p-4 shadow-md flex items-start gap-3 ${
      type === 'success'
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-red-200 bg-red-50'
    }`}>
      {type === 'success' ? (
        <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" />
      ) : (
        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" weight="fill" />
      )}
      <p className={`text-sm flex-1 ${type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
