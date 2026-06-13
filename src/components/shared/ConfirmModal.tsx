"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  isDanger?: boolean;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  isLoading = false,
  isDanger = true,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  // Ensure we don't try to render the portal on the server, and only when open
  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Subtle backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 dark:bg-zinc-950/70 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Flush, architectural card */}
      <div className="relative w-full max-w-[320px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-6 text-center transition-all">
        {icon && (
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center border ${isDanger ? 'border-red-200 text-red-600 dark:border-red-500/30 dark:text-red-400' : 'border-emerald-200 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400'}`}>
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="border border-zinc-200 dark:border-zinc-700 bg-transparent py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-white dark:hover:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors disabled:opacity-60 ${
              isDanger 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}