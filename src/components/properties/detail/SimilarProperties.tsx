"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinIcon, HomeModernIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { getProperties } from "@/lib/api/properties";
import { formatMoney, formatLabel, formatBillingCycle } from "@/lib/utils";

type Props = { property: Property };

export function SimilarProperties({ property }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Primary: same district + same type
        const primary = await getProperties({
          districtId: property.district.id,
          type: property.type,
          status: "AVAILABLE",
          limit: 6,
          page: 1,
        });

        const primaryList = primary.data
          .filter((p) => p.id !== property.id)
          .slice(0, 5);

        if (!cancelled) {
          if (primaryList.length >= 3) {
            setProperties(primaryList);
            setLoading(false);
            return;
          }

          // Fallback: same type, broader area
          const seenIds = new Set([property.id, ...primaryList.map((p) => p.id)]);
          const needed = 5 - primaryList.length;

          const fallback = await getProperties({
            type: property.type,
            status: "AVAILABLE",
            limit: needed + seenIds.size,
            page: 1,
          });

          const fallbackList = fallback.data
            .filter((p) => !seenIds.has(p.id))
            .slice(0, needed);

          if (!cancelled) setProperties([...primaryList, ...fallbackList]);
        }
      } catch {
        // Similar properties are non-critical; fail silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [property.id, property.district.id, property.type]);

  if (loading) return <SimilarSkeleton />;
  if (properties.length === 0) return <SimilarEmpty property={property} />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Similar Properties</h2>
          <p className="mt-1 text-sm text-slate-500">
            More {formatLabel(property.type).toLowerCase()} listings near{" "}
            {property.district.name}
          </p>
        </div>
        <Link
          href={`/explore?type=${property.type}&districtId=${property.district.id}`}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          View all <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((p) => (
          <SimilarPropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Mobile: view all link */}
      <div className="mt-6 sm:hidden">
        <Link
          href={`/explore?type=${property.type}&districtId=${property.district.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          View all similar listings <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ── Property card ─────────────────────────────────────────────────────────────

function SimilarPropertyCard({ property: p }: { property: Property }) {
  const thumbnail = p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url;
  const location = p.area?.name
    ? `${p.area.name}, ${p.district.name}`
    : p.district.name;

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <HomeModernIcon className="h-12 w-12 text-slate-300" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              p.status === "AVAILABLE"
                ? "bg-emerald-600 text-white"
                : "bg-slate-600 text-white"
            }`}
          >
            {p.status === "AVAILABLE" ? "Available" : formatLabel(p.status)}
          </span>
        </div>
        {p.isFeatured && (
          <div className="absolute left-2.5 top-2.5">
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-emerald-700">
          {p.title}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-base font-extrabold text-slate-900">
            {formatMoney(p.price)}
          </span>
          {p.listingPurpose !== "SALE" && p.billingCycle && (
            <span className="text-xs font-medium text-slate-400">
              {formatBillingCycle(p.billingCycle)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function SimilarSkeleton() {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <div className="h-7 w-52 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-100">
            <div className="aspect-[4/3] animate-pulse bg-slate-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function SimilarEmpty({ property }: { property: Property }) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-slate-900">Similar Properties</h2>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <HomeModernIcon className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="font-semibold text-slate-700">No similar listings yet</p>
        <p className="mt-1 text-sm text-slate-500">
          This is one of the first {formatLabel(property.type).toLowerCase()} listings
          in {property.district.name}.
        </p>
      </div>
    </div>
  );
}