"use client";

import { useState, useRef, useEffect } from "react";
import { HomeModernIcon, ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Property } from "@/types/property";

function getMediaItems(property: Property) {
  const items: { type: "video" | "image"; url: string; thumb?: string }[] = [];
  if (property.videos) {
    property.videos.forEach((v) =>
      items.push({ type: "video", url: v.url, thumb: v.thumbnailUrl ?? undefined })
    );
  }
  if (property.images) {
    property.images.forEach((img) =>
      items.push({ type: "image", url: img.url, thumb: img.url })
    );
  }
  return items;
}

export function MediaViewer({ property }: { property: Property }) {
  const mediaItems = getMediaItems(property);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeMedia = mediaItems[activeIndex];

  // Close fullscreen on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    if (isFullscreen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <>
      <div className="overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Cinematic wide aspect ratio */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-black">
          {activeMedia?.type === "video" ? (
            <video
              key={activeMedia.url}
              ref={videoRef}
              src={activeMedia.url}
              controls
              autoPlay
              muted
              className="h-full w-full object-contain"
            />
          ) : activeMedia?.type === "image" ? (
            <div className="group relative h-full w-full">
              <img
                src={activeMedia.url}
                alt={property.title}
                className="h-full w-full object-contain bg-black"
              />
              {/* ── Maximize Button ── */}
              <button
                onClick={() => setIsFullscreen(true)}
                aria-label="View fullscreen"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center bg-zinc-100 dark:bg-zinc-800">
              <HomeModernIcon className="h-16 w-16 text-zinc-300 dark:text-zinc-600" strokeWidth={1} />
            </div>
          )}

          <div className="absolute left-4 top-4 flex gap-2 pointer-events-none">
            {property.isFeatured && (
              <span className="rounded-sm bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                Featured
              </span>
            )}
            {property.type === "HOSTEL" && (
              <span className="rounded-sm bg-zinc-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                Hostel
              </span>
            )}
          </div>
        </div>

        {/* ── Thumbnails ── */}
        {mediaItems.length > 1 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto bg-zinc-950 p-3">
            {mediaItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md transition-all ${
                  activeIndex === idx
                    ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950 opacity-100"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <img
                  src={item.thumb || item.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <PlayIcon className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen Image Modal ── */}
      {isFullscreen && activeMedia?.type === "image" && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <img
            src={activeMedia.url}
            alt="Fullscreen view"
            className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}