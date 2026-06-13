"use client";

import { FavoritesProvider } from "@/components/properties/favorites-context";
import { VideoPlaybackProvider } from "@/components/properties/video-playback-context";
import { Property } from "@/types/property";
import { DetailNavbar } from "./DetailNavbar";
import { MediaViewer } from "./MediaViewer";
import { PropertyInfo } from "./PropertyInfo";
import { StickyActionCard } from "./StickyActionCard";
import { MobileActionBox } from "./MobileActionBox";
import { PropertyVideosSection } from "./PropertyVideosSection";
import { SimilarProperties } from "./SimilarProperties";

export function PropertyDetailView({ property }: { property: Property }) {
  const showVideosSection =
    property.images.length > 0 && property.videos.length > 0;

  return (
    <FavoritesProvider>
      <VideoPlaybackProvider>
        <main className="min-h-screen bg-white dark:bg-zinc-950 pb-32 lg:pb-16 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

            <DetailNavbar propertyId={property.id} />

            <div className="mt-6 mb-10">
              <MediaViewer property={property} />
            </div>

            {/* ── Primary grid ── */}
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
              {/* Left column */}
              <div className="space-y-12 lg:col-span-8">
                <PropertyInfo property={property} />
                {showVideosSection && (
                  <PropertyVideosSection videos={property.videos} />
                )}
              </div>

              {/* Right column: Sticky booking action */}
              <div className="hidden lg:col-span-4 lg:block">
                <StickyActionCard property={property} />
              </div>
            </div>

            <hr className="my-16 border-zinc-200 dark:border-zinc-800" />

            <div className="mb-8">
              <SimilarProperties property={property} />
            </div>
          </div>

          <MobileActionBox property={property} />
        </main>
      </VideoPlaybackProvider>
    </FavoritesProvider>
  );
}