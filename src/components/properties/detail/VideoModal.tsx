"use client";

import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = { url: string; title?: string; onClose: () => void; };

export function VideoModal({ url, title, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          {title && <span className="text-base font-medium text-white/80">{title}</span>}
          <button onClick={onClose} aria-label="Close video" className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
          <video ref={videoRef} src={url} controls autoPlay className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}