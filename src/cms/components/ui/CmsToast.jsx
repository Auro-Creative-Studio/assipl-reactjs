import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

export default function CmsToast({ message = "", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message || !duration) return undefined;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed right-5 top-5 z-[100] w-[min(420px,calc(100vw-40px))] rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-800 shadow-2xl shadow-slate-950/15">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-950">Success</p>
          <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-600">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
