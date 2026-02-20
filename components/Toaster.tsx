import React from 'react';
import { useToast } from '../contexts/ToastContext';

export function Toaster() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`px-4 py-3 rounded-xl shadow-lg border flex items-center justify-between ${
            t.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <span className="text-sm">{t.message}</span>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="ml-2 text-slate-400 hover:text-slate-600"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
