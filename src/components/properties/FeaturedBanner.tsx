"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  // ✅ Memoized — stable reference across renders, effects won't re-fire spuriously
  const slides = useMemo(() => properties.slice(0, 6), [properties]);
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoBuffering, setVideoBuffering] = useState(false);

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

  useEffect(() => {
    if (count !== 1) return;
    const property = slides[0];
    if ((property.videos ?? []).length === 0) return;

    const video = videoRef.current;
    if (!video) return;

    setVideoBuffering(false);

    // ── Race-condition fix ────────────────────────────────────────────────
    // `autoPlay` tells the browser to start loading and playing as soon as
    // the DOM element is created. For cached videos (Cloudflare CDN), the
    // browser fires `canplay` *during* that initial DOM creation — before
    // React's commit phase has had a chance to attach the `onCanPlay`
    // synthetic handler. The event is lost, `setVideoLoading(false)` never
    // runs, and the spinner loops forever.
    //
    // Checking `readyState` synchronously here recovers from that lost event:
    //   readyState >= HAVE_FUTURE_DATA (3) means the browser already has
    //   enough buffered data to play — i.e. `canplay` already fired.
    // ─────────────────────────────────────────────────────────────────────
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      setVideoLoading(false);
    } else {
      setVideoLoading(true);
    }

    video.play().catch(() => {});
  }, [count, slides]);

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

  let displayImage: string | undefined;
  if (isSingle) {
    const images = property.images ?? [];
    if (hasVideo) {
      displayImage = images.length > 0 ? images[0]?.url : undefined;
    } else if (images.length > 0) {
      displayImage = images[imageIndex % images.length]?.url;
    }
  } else {
    displayImage = getPropertyImage(property);
  }

  const location = getPropertyLocation(property);
  const showVideoLoader = isSingle && hasVideo && (videoLoading || videoBuffering);

  return (
    <section
      aria-label="Featured properties"
      className="relative h-[440px] lg:h-[500px] xl:max-h-[600px] select-none overflow-hidden bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {isSingle && hasVideo ? (
        <>
          {displayImage && (
            <img
              src={displayImage}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoLoading ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <video
            ref={videoRef}
            src={property.videos[0].url}
            muted
            loop
            playsInline
            autoPlay
            onLoadStart={() => setVideoLoading(true)}
            onCanPlay={() => setVideoLoading(false)}
            onPlaying={() => { setVideoLoading(false); setVideoBuffering(false); }}
            onWaiting={() => setVideoBuffering(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {showVideoLoader && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950/50 backdrop-blur-[1px]">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-12 w-12 border-b border-t border-zinc-400/30 rounded-sm" />
                <div className="absolute h-12 w-12 animate-spin border-b border-t border-emerald-500 rounded-sm" />
                <PlayIcon className="h-4 w-4 text-zinc-200" />
              </div>
            </div>
          )}
        </>
      ) : (
        <img
          src={displayImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col px-6 py-6 lg:px-10 lg:py-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-zinc-600 bg-zinc-950/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-300 backdrop-blur-sm rounded-sm">
            <StarIcon className="h-3 w-3 stroke-emerald-500" strokeWidth={2} />
            RECOMMENDED
          </span>
          {hasVideo && (
            <span className="inline-flex items-center gap-1 border border-zinc-700 bg-zinc-950/40 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-300 backdrop-blur-sm rounded-sm">
              <PlayIcon className="h-2.5 w-2.5" />
              VIDEO TOUR
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-emerald-500">
            {property.listingPurpose === "SALE" ? "FOR SALE" : "FOR RENT"}
          </p>
          <h2 className="mt-3 line-clamp-2 text-2xl font-light leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {property.title}
          </h2>
          {location && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-light text-zinc-300">
              <MapPinIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              {location}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <p className="text-2xl font-light tracking-tight text-white">
              {formatMoney(property.price)}
              {property.listingPurpose !== "SALE" && (
                <span className="ml-1 text-sm font-light text-zinc-400">
                  {formatBillingCycle(property.billingCycle)}
                </span>
              )}
            </p>
            <Link
              href={`/properties/${property.id}`}
              className="group inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2 text-sm font-medium tracking-wide text-white transition-all hover:border-emerald-500 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-sm"
            >
              VIEW PROPERTY
              <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {!isSingle && (
          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-4">
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to featured property ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={[
                    "h-px transition-all duration-300 focus-visible:outline-none focus-visible:bg-emerald-500 rounded-sm",
                    i === current
                      ? "w-6 bg-emerald-500"
                      : "w-3 bg-zinc-600 hover:bg-zinc-400",
                  ].join(" ")}
                />
              ))}
            </div>
            <p className="text-[11px] font-medium tabular-nums tracking-wide text-zinc-500">
              {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
        )}
      </div>

      {!isSingle && (
        <>
          <button
            type="button"
            aria-label="Previous featured property"
            onClick={() => goTo(current - 1)}
            className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-zinc-700 bg-zinc-950/40 text-zinc-300 backdrop-blur-sm transition hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-sm"
          >
            <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next featured property"
            onClick={() => goTo(current + 1)}
            className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-zinc-700 bg-zinc-950/40 text-zinc-300 backdrop-blur-sm transition hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-sm"
          >
            <ChevronRightIcon className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </>
      )}
    </section>
  );
}