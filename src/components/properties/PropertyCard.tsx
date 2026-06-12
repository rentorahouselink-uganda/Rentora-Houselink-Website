"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDaysIcon,
  EyeIcon,
  HeartIcon,
  HomeModernIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import {
  formatBillingCycle,
  formatLabel,
  formatMoney,
  getPropertyImage,
  getPropertyLocation,
} from "@/lib/utils";
import { Property } from "@/types/property";
import { useAuth } from "@/lib/auth/auth-context";
import { toggleFavorite } from "@/lib/api/favorites";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useFavorites } from "./favorites-context";
import { useVideoPlayback } from "./video-playback-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Three-state touch preview lifecycle:
 *
 *   idle    → thumbnail shown, play button visible
 *   playing → video running, tap-to-pause overlay active
 *   paused  → video frozen on current frame, resume button visible
 *
 * Transitioning to `idle` always resets currentTime so the preview
 * restarts from the beginning next time. Transitioning between
 * `playing` ↔ `paused` preserves currentTime for seamless resume.
 */
type PreviewState = "idle" | "playing" | "paused";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { ready, favoriteIds, toggleFavoriteId } = useFavorites();
  const { activeVideoId, claimPlayback } = useVideoPlayback();

  const imageUrl = getPropertyImage(property);
  const location = getPropertyLocation(property);
  const hasVideo = (property.videos ?? []).length > 0;

  // Refs ────────────────────────────────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Hover (pointer-device) state ─────────────────────────────────────────
  const [isHovering, setIsHovering] = useState(false);

  /**
   * Whether the device supports genuine hover (desktop / trackpad / mouse).
   * Defaults `true` so SSR and first paint match the hover branch, then
   * corrected on the client to prevent hydration mismatch.
   */
  const [canHover, setCanHover] = useState(true);

  // ── Touch preview state ───────────────────────────────────────────────────
  const [previewState, _setPreviewState] = useState<PreviewState>("idle");

  /**
   * Ref that mirrors `previewState` so stable callbacks (IntersectionObserver,
   * context effect) always read the current value without needing to be
   * recreated on every render.
   */
  const previewStateRef = useRef<PreviewState>("idle");

  /** Wrapped setter — keeps the ref and React state in sync atomically. */
  const setPreviewState = useCallback((next: PreviewState) => {
    previewStateRef.current = next;
    _setPreviewState(next);
  }, []);

  // ── Favorites state ───────────────────────────────────────────────────────
  const [isSaved, setIsSaved] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // ── Effects ───────────────────────────────────────────────────────────────

  // Sync saved state from the shared favorites context.
  useEffect(() => {
    if (!ready) return;
    setIsSaved(favoriteIds.has(property.id));
  }, [favoriteIds, property.id, ready]);

  // Detect hover-capable devices on mount; keep in sync for hybrid inputs.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /**
   * Stable helper — resets to `idle`:
   *   • pauses the video and rewinds to the start
   *   • clears both hover and touch preview state
   *
   * Called by the context effect and IntersectionObserver.
   */
  const resetPreview = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsHovering(false);
    setPreviewState("idle");
  }, [setPreviewState]);

  /**
   * "One video at a time" — when another card claims playback on touch
   * devices, reset this one.  Hover devices self-manage via `mouseLeave`.
   */
  useEffect(() => {
    if (canHover) return;
    if (activeVideoId !== null && activeVideoId !== property.id) {
      if (previewStateRef.current !== "idle") {
        resetPreview();
      }
    }
  }, [activeVideoId, canHover, property.id, resetPreview]);

  /**
   * Scroll-out detection — stop any active preview (hover or touch) when
   * the card fully leaves the viewport.
   */
  useEffect(() => {
    if (!hasVideo || !cardRef.current) return;

    const el = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          resetPreview();
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo, resetPreview]);

  // ── Hover handlers (pointer devices) ─────────────────────────────────────

  const handleMouseEnter = () => {
    if (!hasVideo || !canHover) return;
    setIsHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (!hasVideo || !canHover) return;
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // ── Touch preview handlers (non-hover devices) ────────────────────────────

  /** Start playing from idle. */
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    claimPlayback(property.id); // stops all other touch previews
    setPreviewState("playing");
    videoRef.current?.play().catch(() => {});
  };

  /**
   * Pause in place — intentionally does NOT reset `currentTime` so the
   * next resume continues from the same frame (play → pause → resume cycle).
   */
  const handlePauseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    videoRef.current?.pause();
    setPreviewState("paused");
  };

  /** Resume from the paused frame. */
  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    claimPlayback(property.id);
    setPreviewState("playing");
    videoRef.current?.play().catch(() => {});
  };

  // ── Favorites handler ─────────────────────────────────────────────────────

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (isToggling) return;

    const previousSaved = isSaved;
    const nextSaved = !previousSaved;

    // Optimistic update for snappy feel.
    setIsSaved(nextSaved);
    toggleFavoriteId(property.id, nextSaved);
    setIsToggling(true);

    try {
      const response = await toggleFavorite(property.id);
      setIsSaved(response.saved);
      toggleFavoriteId(property.id, response.saved);
    } catch (error) {
      // Revert on API failure.
      setIsSaved(previousSaved);
      toggleFavoriteId(property.id, previousSaved);
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────

  /** True when the video element should be visible (either interaction type). */
  const isPreviewActive = isHovering || previewState !== "idle";

  const formattedAvailableFrom = property.availableFrom
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(property.availableFrom))
    : "";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Login Prompt Modal ── */}
      <ConfirmModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onConfirm={() => router.push("/login")}
        title="Sign in required"
        description="You need to be signed in to save properties to your favorites."
        confirmText="Go to Sign In"
        isDanger={false}
        icon={<HeartIcon className="h-6 w-6" strokeWidth={2} />}
      />

      <div
        ref={cardRef}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Full-card navigation link (z-10) ──────────────────────────── */}
        {/* Invisible anchor that makes the entire card keyboard- and
            pointer-navigable. Interactive overlays sit above this at z-[15]
            and z-20 and intercept their own click areas. */}
        <Link
          href={`/properties/${property.id}`}
          className="absolute inset-0 z-10 focus:outline-none"
          aria-label={`View details for ${property.title}`}
        />

        {/* ── Favorite button (z-20, top-right) ─────────────────────────── */}
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          onClick={handleFavoriteClick}
          disabled={isToggling || !ready}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-400 backdrop-blur-md transition-all hover:scale-110 hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-400 disabled:opacity-70"
        >
          {isSaved ? (
            <HeartIconSolid className="h-5 w-5 fill-rose-500 text-rose-500 transition-transform" />
          ) : (
            <HeartIcon className="h-5 w-5 transition-transform" />
          )}
        </button>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* Media area                                                       */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">

          {/* Thumbnail image ─────────────────────────────────────────────── */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className={[
                "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
                isPreviewActive && hasVideo ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-emerald-50 dark:bg-emerald-950/30">
              <HomeModernIcon className="h-12 w-12 text-emerald-200" />
            </div>
          )}

          {/* Video element ───────────────────────────────────────────────── */}
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
                isPreviewActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          )}

          {/* Top-left badges ─────────────────────────────────────────────── */}
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

          {/* ── Hover play indicator (pointer devices, pointer-events-none) ── */}
          {/* A purely decorative cue; actual playback is via mouseEnter.     */}
          {hasVideo && canHover && (
            <div
              className={[
                "pointer-events-none absolute inset-0 flex items-center justify-center",
                "transition-all duration-300 ease-out",
                isHovering ? "scale-90 opacity-0" : "scale-100 opacity-100",
              ].join(" ")}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/40 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                <PlayIcon className="h-6 w-6 translate-x-0.5" />
              </div>
            </div>
          )}

          {/* ── Touch controls (non-hover devices) ──────────────────────── */}
          {/*                                                                 */}
          {/* idle    → centered play button                                  */}
          {/* playing → translucent tap-to-pause layer                       */}
          {/* paused  → centered resume button                               */}
          {/*                                                                 */}
          {/* All sit at z-[15]: above the navigation link (z-10) but below  */}
          {/* the favorite button and Book/Enquire CTA (z-20).               */}
          {hasVideo && !canHover && (
            <>
              {/* ── Idle: play button ── */}
              {previewState === "idle" && (
                <div className="absolute inset-0 z-[15] flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Play video preview"
                    onClick={handlePlayClick}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/40 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform active:scale-95"
                  >
                    <PlayIcon className="h-6 w-6 translate-x-0.5" />
                  </button>
                </div>
              )}

              {/* ── Playing: tap the video to pause ── */}
              {/* The translucent pause hint lets the user know this area is  */}
              {/* tappable without obscuring the video.                       */}
              {previewState === "playing" && (
                <button
                  type="button"
                  aria-label="Pause video preview"
                  onClick={handlePauseClick}
                  className="absolute inset-0 z-[15] flex items-center justify-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/20 text-white/50 backdrop-blur-sm">
                    <PauseIcon className="h-5 w-5" />
                  </div>
                </button>
              )}

              {/* ── Paused: resume button ── */}
              {previewState === "paused" && (
                <div className="absolute inset-0 z-[15] flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Resume video preview"
                    onClick={handleResumeClick}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/40 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform active:scale-95"
                  >
                    <PlayIcon className="h-6 w-6 translate-x-0.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Book / Enquire CTA (z-20, bottom-right of media) ─────────── */}
          {/* Sits above the navigation link (z-10) so it intercepts its own  */}
          {/* tap area; navigates to the same detail page for a focused CTA.  */}
          <Link
            href={`/properties/${property.id}`}
            aria-label={`Book or enquire about ${property.title}`}
            className="absolute bottom-3 right-3 z-20 inline-flex items-center rounded-full bg-emerald-600/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-emerald-600 hover:scale-105 active:scale-95"
          >
            Book / Enquire
          </Link>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* Content area                                                     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="relative flex flex-1 flex-col p-4">
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
              <span
                className={
                  property.status === "AVAILABLE"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : ""
                }
              >
                {property.status === "AVAILABLE"
                  ? "Available"
                  : formatLabel(property.status)}
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
      </div>
    </>
  );
}