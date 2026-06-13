"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyPagination } from "@/components/properties/PropertyPagination";
import { FeaturedBanner } from "@/components/properties/FeaturedBanner";
import { PaginationMeta } from "@/types/pagination";
import { Property } from "@/types/property";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useHeaderCompact } from "../layout/header-compact-context";
import {
  ExplorePendingProvider,
  useExplorePending,
} from "./explore-pending-context";
import { FavoritesProvider } from "./favorites-context";
import { VideoPlaybackProvider } from "./video-playback-context";

type ExplorePageProps = {
  properties: Property[];
  meta: PaginationMeta;
  searchParams: Record<string, string | string[] | undefined>;
  featuredProperties: Property[];
  error?: string;
};

const FILTER_KEYS = [
  "search",
  "type",
  "listingPurpose",
  "districtId",
  "universityId",
  "minPrice",
  "maxPrice",
  "numberOfRooms",
];

function isFiltered(
  params: Record<string, string | string[] | undefined>,
): boolean {
  return FILTER_KEYS.some((key) => {
    const v = params[key];
    return v !== undefined && v !== "" && v !== null;
  });
}

const COMPACT_THRESHOLD = 60;
const SCROLL_DELTA = 20;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ExplorePage(props: ExplorePageProps) {
  return (
    <ExplorePendingProvider>
      <FavoritesProvider>
        <VideoPlaybackProvider>
          <ExplorePageContent {...props} />
        </VideoPlaybackProvider>
      </FavoritesProvider>
    </ExplorePendingProvider>
  );
}

function ExplorePageContent({
  properties,
  meta,
  searchParams,
  featuredProperties,
  error,
}: ExplorePageProps) {
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const tickingRef = useRef(false);

  const { setIsHeaderCompact } = useHeaderCompact();
  const { isPending } = useExplorePending();

  useIsomorphicLayoutEffect(() => {
    const y = window.scrollY;
    lastScrollY.current = y;
    setIsCompact(y > COMPACT_THRESHOLD);
  }, []);

  useEffect(() => {
    setIsHeaderCompact(isCompact);
    return () => setIsHeaderCompact(false);
  }, [isCompact, setIsHeaderCompact]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 0) {
          tickingRef.current = false;
          return;
        }
        if (y < COMPACT_THRESHOLD) {
          setIsCompact((prev) => (prev ? false : prev));
          lastScrollY.current = y;
          tickingRef.current = false;
          return;
        }

        const diff = y - lastScrollY.current;
        if (diff > SCROLL_DELTA) {
          setIsCompact((prev) => (prev ? prev : true));
          lastScrollY.current = y;
        } else if (diff < -SCROLL_DELTA) {
          setIsCompact((prev) => (prev ? false : prev));
          lastScrollY.current = y;
        }
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = isFiltered(searchParams);
  const showBadge = !error && filtered;

  return (
    <main className="min-h-screen bg-zinc-50 pb-12 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100 [overflow-anchor:none]">
      {featuredProperties.length > 0 && !error && (
        <FeaturedBanner properties={featuredProperties} />
      )}

      {/* ── Sticky header + filters ── */}
      <div
        className={[
          "sticky top-16 z-40 bg-zinc-50/95 backdrop-blur-md transition-colors duration-300 dark:bg-zinc-950/95",
          isCompact
            ? "border-transparent shadow-none"
            : "border-b border-zinc-200 dark:border-zinc-800",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-in-out",
              isCompact
                ? "max-h-0 opacity-0"
                : "max-h-[160px] opacity-100 pt-8 pb-6",
            ].join(" ")}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-900 dark:text-white">
                  Explore properties
                </h1>
                <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
                  {filtered
                    ? `${meta.total.toLocaleString()} ${
                        meta.total === 1 ? "property" : "properties"
                      } found`
                    : "Verified properties across Uganda"}
                </p>
              </div>
              {showBadge && (
                <div className="inline-flex items-center self-start md:self-end border-b border-emerald-600 px-1 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-500 dark:text-emerald-500">
                  {meta.total.toLocaleString()} results
                </div>
              )}
            </div>
          </div>

          <div
            className={[
              "transition-all duration-300",
              isCompact ? "py-4" : "pb-6",
            ].join(" ")}
          >
            <PropertyFilters isCompact={isCompact} />
          </div>
        </div>
      </div>

      {/* ── Property grid ── */}
      <section
        aria-busy={isPending}
        className={[
          "mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 transition-opacity duration-500",
          isPending ? "pointer-events-none opacity-50" : "opacity-100",
        ].join(" ")}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-700">
            <ExclamationTriangleIcon
              className="mb-6 h-12 w-12 text-zinc-300 dark:text-zinc-700"
              strokeWidth={1}
            />
            <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white mb-2">
              Connection interrupted.
            </h2>
            <p className="max-w-md text-zinc-500 dark:text-zinc-400 mb-8">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500 border-b border-emerald-600 dark:border-emerald-500 pb-1 hover:opacity-60 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="mt-16">
              <PropertyPagination meta={meta} searchParams={searchParams} />
            </div>
          </>
        ) : (
          <div className="py-32 text-center border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white mb-2">
              No matches found.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Adjust your filters or try a broader search parameter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}