"use client";

import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { FilmIcon } from "@heroicons/react/24/outline";
import { PropertyVideo } from "@/types/property";
import { VideoModal } from "./VideoModal";

const VIDEO_TYPE_LABELS: Record<string, string> = {
  WALKTHROUGH: "Walkthrough",
  OVERVIEW: "Overview",
  AMENITIES: "Amenities",
  EXTERIOR: "Exterior",
  INTERIOR: "Interior",
  TOUR: "Virtual Tour",
};

type Props = {
  videos: PropertyVideo[];
};

export function PropertyVideosSection({ videos }: Props) {
  const [activeVideo, setActiveVideo] = useState<PropertyVideo | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <FilmIcon className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Property Videos</h2>
          <p className="text-xs text-slate-500">
            {videos.length} {videos.length === 1 ? "clip" : "clips"} available
          </p>
        </div>
      </div>

      {/* Responsive grid: 1 col → 2 col → 3 col */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, idx) => (
          <VideoCard
            key={video.id}
            video={video}
            index={idx}
            onPlay={() => setActiveVideo(video)}
          />
        ))}
      </div>

      {activeVideo && (
        <VideoModal
          url={activeVideo.url}
          title={
            VIDEO_TYPE_LABELS[activeVideo.videoType] ??
            activeVideo.videoType.replace(/_/g, " ")
          }
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}

// ── Video card ────────────────────────────────────────────────────────────────

type VideoCardProps = {
  video: PropertyVideo;
  index: number;
  onPlay: () => void;
};

function VideoCard({ video, index, onPlay }: VideoCardProps) {
  const label =
    VIDEO_TYPE_LABELS[video.videoType] ?? video.videoType.replace(/_/g, " ");

  return (
    <button
      onClick={onPlay}
      aria-label={`Play ${label} video`}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      {/* Thumbnail */}
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt={`${label} thumbnail`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Centred play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-transform duration-200 group-hover:scale-110 group-hover:bg-white/30">
          <PlayIcon className="h-5 w-5 text-white translate-x-0.5" />
        </div>
      </div>

      {/* Type badge */}
      <div className="absolute bottom-3 left-3">
        <span className="inline-flex items-center rounded-md bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {label}
        </span>
      </div>
    </button>
  );
}