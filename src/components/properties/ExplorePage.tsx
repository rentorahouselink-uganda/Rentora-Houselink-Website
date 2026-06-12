"use client";

import { useEffect, useRef, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyPagination } from "@/components/properties/PropertyPagination";
import { FeaturedBanner } from "@/components/properties/FeaturedBanner";
import { PaginationMeta } from "@/types/pagination";
import { Property } from "@/types/property";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useHeaderCompact } from "../layout/header-compact-context";

type ExplorePageProps = {
  properties:         Property[];
  meta:               PaginationMeta;
  searchParams:       Record<string, string | string[] | undefined>;
  featuredProperties: Property[];
  error?:             string;
};

const FILTER_KEYS = [
  "search", "type", "listingPurpose", "districtId",
  "universityId", "minPrice", "maxPrice", "numberOfRooms",
];

function isFiltered(params: Record<string, string | string[] | undefined>): boolean {
  return FILTER_KEYS.some((key) => {
    const v = params[key];
    return v !== undefined && v !== "" && v !== null;
  });
}

const COMPACT_THRESHOLD = 60;
const SCROLL_DELTA = 20;

export function ExplorePage({
  properties,
  meta,
  searchParams,
  featuredProperties,
  error,
}: ExplorePageProps) {
  // Initialize based on the *actual* scroll position at mount time.
  // This matters when returning from a detail page where the browser
  // restores the previous scroll offset — without this, the header
  // would render expanded for a frame at a scroll position where it
  // should already be compact, causing an immediate layout-shift loop.
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > COMPACT_THRESHOLD;
  });

  const lastScrollY = useRef(0);
  const tickingRef  = useRef(false);

  const { setIsHeaderCompact } = useHeaderCompact();

  // Mirror this page's compact state up to the global Header so its
  // bottom border can fade out and the two bars read as one piece.
  // Reset on unmount so navigating away restores the header's normal border.
  useEffect(() => {
    setIsHeaderCompact(isCompact);
    return () => setIsHeaderCompact(false);
  }, [isCompact, setIsHeaderCompact]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        // 1. Mobile rubber-banding protection
        if (y <= 0) {
          tickingRef.current = false;
          return;
        }

        // 2. Safety net: always snap open near the very top
        if (y < COMPACT_THRESHOLD) {
          setIsCompact((prev) => (prev ? false : prev));
          lastScrollY.current = y;
          tickingRef.current = false;
          return;
        }

        const diff = y - lastScrollY.current;

        // 3. Deliberate scrolling thresholds
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
    // Intentionally no deps: handler must stay stable across isCompact
    // changes, otherwise every toggle re-anchors lastScrollY against a
    // scroll position the browser may have just shifted via scroll
    // anchoring, causing the toggle to immediately flip back.
  }, []);

  const filtered   = isFiltered(searchParams);
  const showBadge  = !error && filtered;

  return (
    <main
      className="min-h-screen bg-slate-50 pb-12 dark:bg-slate-950 [overflow-anchor:none]"
    >

      {/* ── 1. Featured Banner ── */}
      {featuredProperties.length > 0 && !error && (
        <FeaturedBanner properties={featuredProperties} />
      )}

      {/* ── 2. Sticky header + filters ── */}
      <div
        className={[
          "sticky top-16 z-40 border-b bg-white/95 backdrop-blur-md transition-colors duration-300 dark:bg-slate-900/95",
          isCompact
            ? "border-transparent shadow-none"
            : "border-slate-200 shadow-sm dark:border-slate-700",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Title section — collapses on scroll-down */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-in-out",
              isCompact
                ? "max-h-0 opacity-0"
                : "max-h-[160px] opacity-100 pt-6 pb-4",
            ].join(" ")}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  Explore properties
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {filtered
                    ? `${meta.total.toLocaleString()} ${meta.total === 1 ? "property" : "properties"} found`
                    : "Verified properties across Uganda"}
                </p>
              </div>
              {showBadge && (
                <div className="inline-flex items-center self-start rounded-full border border-emerald-200 px-3 py-1 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:text-emerald-400">
                  {meta.total.toLocaleString()} results
                </div>
              )}
            </div>
          </div>

          {/* Filters — always visible, padding shrinks in compact mode */}
          <div
            className={[
              "transition-all duration-300",
              isCompact ? "py-3" : "pb-5",
            ].join(" ")}
          >
            <PropertyFilters isCompact={isCompact} />
          </div>
        </div>
      </div>

      {/* ── 3. Property grid ── */}
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center dark:border-red-900 dark:bg-red-950/30">
            <ExclamationTriangleIcon className="mb-4 h-12 w-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-bold text-red-800 dark:text-red-400">Connection Error</h2>
            <p className="mt-2 max-w-md text-sm text-red-600 dark:text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="mt-10">
              <PropertyPagination meta={meta} searchParams={searchParams} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-600 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching properties
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search, category, or price filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}