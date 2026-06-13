"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toggleFavorite } from "@/lib/api/favorites";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavorites } from "@/components/properties/favorites-context";

type Props = {
  propertyId: string;
};

export function DetailNavbar({ propertyId }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { ready, favoriteIds, toggleFavoriteId } = useFavorites();

  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setIsSaved(favoriteIds.has(propertyId));
  }, [favoriteIds, propertyId, ready]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (isToggling || !ready) return;

    const previousSaved = isSaved;
    const nextSaved = !previousSaved;

    setIsSaved(nextSaved);
    toggleFavoriteId(propertyId, nextSaved);
    setIsToggling(true);

    try {
      const response = await toggleFavorite(propertyId);
      setIsSaved(response.saved);
      toggleFavoriteId(propertyId, response.saved);
    } catch (error) {
      setIsSaved(previousSaved);
      toggleFavoriteId(propertyId, previousSaved);
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied! Paste it anywhere to share this property.", {
      duration: 3000,
      position: "top-center",
      style: {
        borderRadius: "0px", // Kept standard, but fits minimalist aesthetic
        fontSize: "13px",
        fontWeight: "600",
      },
    });
  };

  return (
    <>
      <Toaster />

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

      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium tracking-wide text-zinc-500 hover:bg-zinc-100 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Explore
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleFavoriteClick}
            disabled={!ready || isToggling}
            aria-label={isSaved ? "Remove from saved" : "Save property"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400 disabled:opacity-50"
          >
            {isSaved ? (
              <HeartIconSolid className="h-5 w-5 fill-rose-500 text-rose-500" />
            ) : (
              <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>

          <button
            onClick={handleShare}
            aria-label="Copy link to property"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400"
          >
            {copied ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Copied!
              </span>
            ) : (
              <ShareIcon className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}