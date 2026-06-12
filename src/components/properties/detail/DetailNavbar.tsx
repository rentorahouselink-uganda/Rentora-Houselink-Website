"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
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

      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
        >
          <ChevronLeftIcon className="h-5 w-5" /> Back to Explore
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            disabled={!ready || isToggling}
            aria-label={isSaved ? "Remove from saved" : "Save property"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isSaved ? (
              <HeartIconSolid className="h-5 w-5 fill-rose-500 text-rose-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}