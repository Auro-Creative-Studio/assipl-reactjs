import { X } from "lucide-react";
import { createPortal } from "react-dom";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Popup({
  isOpen = false,
  title,
  description,
  children,
  footer,
  onClose,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-dvh w-screen items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close popup overlay"
        className="fixed inset-0 h-dvh w-screen bg-slate-950/60 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "popup-title" : undefined}
        className={`
          relative z-10 w-full overflow-hidden rounded-2xl border border-slate-200
          bg-white shadow-2xl shadow-slate-950/20
          ${sizeClasses[size] ?? sizeClasses.md}
          ${className}
        `}
      >
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 px-6 py-5">
          <div>
            {title && (
              <h2 id="popup-title" className="text-xl font-black text-slate-950">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label="Close popup"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </section>
    </div>,
    document.body
  );
}
