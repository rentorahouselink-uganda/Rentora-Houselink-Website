"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { getProperties } from "@/lib/api/properties";
import { formatLabel } from "@/lib/utils";
import { PropertyCard } from "@/components/properties/PropertyCard";

type Props = { property: Property };

export function SimilarProperties({ property }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
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
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [property.id, property.district.id, property.type]);

  if (loading) return <SimilarSkeleton />;
  if (properties.length === 0) return null;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
            Similar Properties
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            More {formatLabel(property.type).toLowerCase()} listings near{" "}
            {property.district.name}
          </p>
        </div>
        <Link
          href={`/explore?type=${property.type}&districtId=${property.district.id}`}
          className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 hover:opacity-70 transition-opacity"
        >
          View all <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href={`/explore?type=${property.type}&districtId=${property.district.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 hover:opacity-70 transition-opacity"
        >
          View all similar listings <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function SimilarSkeleton() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <div className="h-7 w-52 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-72 animate-pulse bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden border border-zinc-100 dark:border-zinc-800">
            <div className="aspect-[4/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2 bg-white dark:bg-zinc-900 p-5">
              <div className="h-3 w-1/3 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-5 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-2/3 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}