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

type PreviewState = "idle" | "playing" | "paused";

export function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { ready, favoriteIds, toggleFavoriteId } = useFavorites();
  const { activeVideoId, claimPlayback } = useVideoPlayback();

  const imageUrl = getPropertyImage(property);
  const location = getPropertyLocation(property);
  const hasVideo = (property.videos ?? []).length > 0;

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [previewState, _setPreviewState] = useState<PreviewState>("idle");
  const previewStateRef = useRef<PreviewState>("idle");

  const setPreviewState = useCallback((next: PreviewState) => {
    previewStateRef.current = next;
    _setPreviewState(next);
  }, []);

  const [isSaved, setIsSaved] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setIsSaved(favoriteIds.has(property.id));
  }, [favoriteIds, property.id, ready]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resetPreview = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsHovering(false);
    setPreviewState("idle");
  }, [setPreviewState]);

  useEffect(() => {
    if (canHover) return;
    if (activeVideoId !== null && activeVideoId !== property.id) {
      if (previewStateRef.current !== "idle") resetPreview();
    }
  }, [activeVideoId, canHover, property.id, resetPreview]);

  useEffect(() => {
    if (!hasVideo || !cardRef.current) return;
    const el = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) resetPreview(); },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo, resetPreview]);

  const handleMouseEnter = () => { if (hasVideo && canHover) { setIsHovering(true); videoRef.current?.play().catch(() => {}); } };
  const handleMouseLeave = () => { if (hasVideo && canHover) { setIsHovering(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } } };

  const handlePlayClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); claimPlayback(property.id); setPreviewState("playing"); videoRef.current?.play().catch(() => {}); };
  const handlePauseClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); videoRef.current?.pause(); setPreviewState("paused"); };
  const handleResumeClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); claimPlayback(property.id); setPreviewState("playing"); videoRef.current?.play().catch(() => {}); };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { setShowLoginPrompt(true); return; }
    if (isToggling) return;
    const previousSaved = isSaved;
    setIsSaved(!previousSaved);
    toggleFavoriteId(property.id, !previousSaved);
    setIsToggling(true);
    try {
      const response = await toggleFavorite(property.id);
      setIsSaved(response.saved);
      toggleFavoriteId(property.id, response.saved);
    } catch (error) {
      setIsSaved(previousSaved);
      toggleFavoriteId(property.id, previousSaved);
    } finally { setIsToggling(false); }
  };

  const isPreviewActive = isHovering || previewState !== "idle";
  const formattedAvailableFrom = property.availableFrom
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(property.availableFrom))
    : "";

  return (
    <>
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
        className="group relative flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:border-emerald-600 dark:hover:border-emerald-500"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/properties/${property.id}`} className="absolute inset-0 z-10 focus:outline-none" aria-label={`View details for ${property.title}`} />

        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          onClick={handleFavoriteClick}
          disabled={isToggling || !ready}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center bg-white/90 text-zinc-900 backdrop-blur-md transition-all hover:bg-emerald-600 hover:text-white dark:bg-zinc-950/80 dark:text-white disabled:opacity-70"
        >
          {isSaved ? <HeartIconSolid className="h-5 w-5 fill-emerald-600 text-emerald-600" /> : <HeartIcon className="h-5 w-5" />}
        </button>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {imageUrl ? (
            <img src={imageUrl} alt={property.title} className={["h-full w-full object-cover transition-transform duration-700 group-hover:scale-105", isPreviewActive && hasVideo ? "opacity-0" : "opacity-100"].join(" ")} />
          ) : (
            <div className="grid h-full w-full place-items-center bg-zinc-100 dark:bg-zinc-800"><HomeModernIcon className="h-12 w-12 text-zinc-300" /></div>
          )}

          {hasVideo && (
            <video ref={videoRef} src={property.videos[0].url} muted loop playsInline preload="none" className={["absolute inset-0 h-full w-full object-cover transition-opacity duration-300", isPreviewActive ? "opacity-100" : "opacity-0"].join(" ")} />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {property.isFeatured && <span className="inline-flex items-center gap-1 bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white"><StarIcon className="h-3 w-3" /> Featured</span>}
            {property.listingPurpose === "SALE" && <span className="inline-flex bg-zinc-900 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">For Sale</span>}
          </div>

          {hasVideo && canHover && (
            <div className={["pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300", isHovering ? "scale-90 opacity-0" : "scale-100 opacity-100"].join(" ")}>
              <div className="flex h-12 w-12 items-center justify-center bg-black/30 text-white backdrop-blur-md"><PlayIcon className="h-6 w-6" /></div>
            </div>
          )}

          {hasVideo && !canHover && (
            <>
              {previewState === "idle" && ( <div className="absolute inset-0 z-[15] flex items-center justify-center"><button type="button" onClick={handlePlayClick} className="flex h-12 w-12 items-center justify-center bg-black/30 text-white backdrop-blur-md"><PlayIcon className="h-6 w-6" /></button></div>)}
              {previewState === "playing" && ( <button type="button" onClick={handlePauseClick} className="absolute inset-0 z-[15] flex items-center justify-center"><div className="flex h-10 w-10 items-center justify-center bg-black/20 text-white/50 backdrop-blur-sm"><PauseIcon className="h-5 w-5" /></div></button>)}
              {previewState === "paused" && ( <div className="absolute inset-0 z-[15] flex items-center justify-center"><button type="button" onClick={handleResumeClick} className="flex h-12 w-12 items-center justify-center bg-black/30 text-white backdrop-blur-md"><PlayIcon className="h-6 w-6" /></button></div>)}
            </>
          )}

          <Link href={`/properties/${property.id}`} className="absolute bottom-3 right-3 z-20 inline-flex items-center bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-emerald-700">Book / Enquire</Link>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">{formatLabel(property.type)}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400"><EyeIcon className="h-3 w-3" /> {property.viewCount}</span>
          </div>
          <h3 className="line-clamp-1 text-base font-bold text-zinc-900 dark:text-white">
            {formatMoney(property.price)}
            {property.listingPurpose !== "SALE" && <span className="ml-1 text-xs font-medium text-zinc-500">{formatBillingCycle(property.billingCycle)}</span>}
          </h3>
          <p className="line-clamp-1 text-sm text-zinc-600 dark:text-zinc-400">{property.title}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500"><MapPinIcon className="h-3.5 w-3.5" /> {location || "Location unavailable"}</p>
          <div className="mt-auto pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>{property.numberOfRooms} Rooms</span>
              <span>{property.parkingAvailable ? "Parking" : "No Pkng"}</span>
              <span className={property.status === "AVAILABLE" ? "text-emerald-600" : ""}>{property.status === "AVAILABLE" ? "Available" : formatLabel(property.status)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}