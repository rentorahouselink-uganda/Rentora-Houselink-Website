"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  CalendarDaysIcon,
  EyeIcon,
  HeartIcon,
  HomeModernIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  formatBillingCycle,
  formatLabel,
  formatMoney,
  getPropertyImage,
  getPropertyLocation,
} from "@/lib/utils";
import { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  const imageUrl = getPropertyImage(property);
  const location = getPropertyLocation(property);
  const hasVideo = (property.videos ?? []).length > 0;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    if (!hasVideo) return;
    setIsHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (!hasVideo) return;
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const formattedAvailableFrom = property.availableFrom
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
      }).format(new Date(property.availableFrom))
    : "";

  return (
    <Link
      href={`/properties/${property.id}`}
      // Shadows removed — border + subtle lift on hover is enough
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Media ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className={[
              "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
              isHovering && hasVideo ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-emerald-50 dark:bg-emerald-950/30">
            <HomeModernIcon className="h-12 w-12 text-emerald-200" />
          </div>
        )}

        {hasVideo && (
          <video
            ref={videoRef}
            src={property.videos[0].url}
            muted
            loop
            playsInline
            preload="none"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              isHovering ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        )}

        {/* Play button overlay */}
        {hasVideo && (
          <div
            className={[
              "pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
              isHovering ? "scale-90 opacity-0" : "scale-100 opacity-100",
            ].join(" ")}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/40 text-white backdrop-blur-md ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110">
              <PlayIcon className="h-6 w-6 translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {property.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <StarIcon className="h-3 w-3" /> Featured
            </span>
          )}
          {property.listingPurpose === "SALE" && (
            <span className="inline-flex rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              For Sale
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          type="button"
          aria-label="Save property"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-400 backdrop-blur-md transition hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-400"
        >
          <HeartIcon className="h-5 w-5" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {formatLabel(property.type)}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <EyeIcon className="h-3.5 w-3.5" /> {property.viewCount}
          </span>
        </div>

        <h3 className="mt-1 line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
          {formatMoney(property.price)}
          {property.listingPurpose !== "SALE" && (
            <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {formatBillingCycle(property.billingCycle)}
            </span>
          )}
        </h3>

        <p className="line-clamp-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          {property.title}
        </p>

        <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{location || "Location unavailable"}</span>
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-xs font-medium text-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <HomeModernIcon className="h-4 w-4 text-slate-400" />
              {property.numberOfRooms} Rooms
            </span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-600" />
            <span>{property.parkingAvailable ? "Parking" : "No Parking"}</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-600" />
            <span className={property.status === "AVAILABLE" ? "text-emerald-600 dark:text-emerald-400" : ""}>
              {property.status === "AVAILABLE" ? "Available" : formatLabel(property.status)}
            </span>
          </div>

          {property.availableFrom && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              Available from {formattedAvailableFrom}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}