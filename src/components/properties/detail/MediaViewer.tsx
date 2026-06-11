"use client";

import { useState, useRef } from "react";
import { HomeModernIcon } from "@heroicons/react/24/outline";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeMedia = mediaItems[activeIndex];

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-black">
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
          <img
            src={activeMedia.url}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-slate-100">
            <HomeModernIcon className="h-16 w-16 text-slate-300" />
          </div>
        )}
        
        <div className="absolute left-4 top-4 flex gap-2">
          {property.isFeatured && (
            <span className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
              Featured
            </span>
          )}
          {/* FIX: Use property.type directly instead of the missing getter */}
          {property.type === "HOSTEL" && (
            <span className="rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-md">
              Hostel
            </span>
          )}
        </div>
      </div>

      {mediaItems.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-slate-900 p-3">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                activeIndex === idx
                  ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900 opacity-100"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={item.thumb || item.url}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayIcon className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}