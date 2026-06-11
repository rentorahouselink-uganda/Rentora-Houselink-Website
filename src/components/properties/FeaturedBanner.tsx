"use client";

import { useCallback, useEffect, useState } from "react";
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

  // Auto-advance — restarts cleanly when paused state changes
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

  if (count === 0) return null;

  const property = slides[current];
  const imageUrl = getPropertyImage(property);
  const location = getPropertyLocation(property);
  const hasVideo = (property.videos ?? []).length > 0;

  return (
    <section
      aria-label="Featured properties"
      className="relative h-[440px] select-none overflow-hidden bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides (all pre-rendered for instant crossfade) ── */}
      {slides.map((p, i) => {
        const img = getPropertyImage(p);
        return (
          <div
            key={p.id}
            aria-hidden={i !== current}
            className={[
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              i === current ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {img ? (
              <img src={img} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-900 to-slate-900" />
            )}
          </div>
        );
      })}

      {/* ── Gradient overlays ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="absolute inset-0 flex flex-col px-8 py-8 lg:px-12 lg:py-10">
        {/* Top badges */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm">
            <StarIcon className="h-3 w-3" strokeWidth={2.5} />
            Featured Properties
          </span>
          {hasVideo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <PlayIcon className="h-2.5 w-2.5" />
              Video Tour
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Property info */}
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              View Property
              <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Dot indicators + counter */}
        {count > 1 && (
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

      {/* ── Arrow navigation ── */}
      {count > 1 && (
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