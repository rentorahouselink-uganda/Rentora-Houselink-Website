"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  formatBillingCycle,
  formatMoney,
  getPropertyImage,
  getPropertyLocation,
} from "@/lib/utils";
import { Property } from "@/types/property";

const SLIDE_DURATION_MS = 5_000;

export function FeaturedBanner({ properties }: { properties: Property[] }) {
  const slides = properties.slice(0, 6);
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-advance for multi-slide only
  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(
      () => setCurrent((prev) => (prev + 1) % count),
      SLIDE_DURATION_MS,
    );
    return () => clearInterval(id);
  }, [count, paused]);

  const goTo = useCallback(
    (index: number) => setCurrent(((index % count) + count) % count),
    [count],
  );

  // Single property: auto‑play video if exists
  useEffect(() => {
    if (count !== 1) return;
    const property = slides[0];
    if ((property.videos ?? []).length > 0) {
      videoRef.current?.play().catch(() => {});
    }
  }, [count, slides]);

  // Single property with multiple images: cycle images
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    if (count !== 1) return;
    const property = slides[0];
    const images = property.images ?? [];
    if (images.length > 1) {
      const id = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(id);
    }
  }, [count, slides]);

  if (count === 0) return null;

  const property = slides[current];
  const isSingle = count === 1;
  const hasVideo = (property.videos ?? []).length > 0;

  // Get image for the current slide, but for single+multi image use imageIndex
  let displayImage: string | undefined;
  if (isSingle) {
    const images = property.images ?? [];
    if (hasVideo) {
      // will show video, but also fallback image
      displayImage = images.length > 0 ? images[0]?.url : undefined;
    } else if (images.length > 0) {
      displayImage = images[imageIndex % images.length]?.url;
    }
  } else {
    displayImage = getPropertyImage(property);
  }

  const location = getPropertyLocation(property);

  return (
    <section
      aria-label="Featured properties"
      className="relative h-[440px] lg:h-[500px] xl:max-h-[600px] select-none overflow-hidden bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background media */}
      {isSingle && hasVideo ? (
        <video
          ref={videoRef}
          src={property.videos[0].url}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={displayImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Solid overlay (NO gradients) */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col px-8 py-8 lg:px-12 lg:py-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950">
            <StarIcon className="h-3 w-3" strokeWidth={2.5} />
            Recommended
          </span>
          {hasVideo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <PlayIcon className="h-2.5 w-2.5" />
              Video Tour
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {property.listingPurpose === "SALE" ? "For Sale" : "For Rent"}
          </p>
          <h2 className="mt-2 line-clamp-2 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
            {property.title}
          </h2>
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
              <MapPinIcon className="h-4 w-4 shrink-0" />
              {location}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-2xl font-extrabold text-white">
              {formatMoney(property.price)}
              {property.listingPurpose !== "SALE" && (
                <span className="ml-1 text-sm font-medium text-white/65">
                  {formatBillingCycle(property.billingCycle)}
                </span>
              )}
            </p>
            <Link
              href={`/properties/${property.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              View Property
              <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Dot indicators + counter only if more than one */}
        {!isSingle && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to featured property ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none",
                    i === current
                      ? "w-7 bg-emerald-400"
                      : "w-2 bg-white/35 hover:bg-white/60",
                  ].join(" ")}
                />
              ))}
            </div>
            <p className="text-xs font-semibold tabular-nums text-white/40">
              {current + 1} / {count}
            </p>
          </div>
        )}
      </div>

      {/* Arrow navigation only if more than one */}
      {!isSingle && (
        <>
          <button
            type="button"
            aria-label="Previous featured property"
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none"
          >
            <ChevronLeftIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next featured property"
            onClick={() => goTo(current + 1)}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none"
          >
            <ChevronRightIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </>
      )}
    </section>
  );
}