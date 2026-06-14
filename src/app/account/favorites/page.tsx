"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { getProperty } from "@/lib/api/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  FavoritesProvider,
  useFavorites,
} from "@/components/properties/favorites-context";
import { Property } from "@/types/property";

export default function FavoritesPage() {
  return (
    <FavoritesProvider>
      <FavoritesPageContent />
    </FavoritesProvider>
  );
}

function FavoritesPageContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { ready, favoriteIds } = useFavorites();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const favoriteIdList = useMemo(() => Array.from(favoriteIds), [favoriteIds]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (!ready || !isAuthenticated) return;

      setLoadingProperties(true);
      setError("");

      try {
        if (favoriteIdList.length === 0) {
          if (!cancelled) setProperties([]);
          return;
        }

        const results = await Promise.allSettled(
          favoriteIdList.map((id) => getProperty(id)),
        );

        const loaded = results
          .map((result) =>
            result.status === "fulfilled" ? result.value : null,
          )
          .filter((item): item is Property => item !== null);

        if (!cancelled) setProperties(loaded);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load saved properties.",
          );
          setProperties([]);
        }
      } finally {
        if (!cancelled) setLoadingProperties(false);
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [favoriteIdList, isAuthenticated, ready, reloadKey]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const total = favoriteIdList.length;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-zinc-50 pb-16 font-sans dark:bg-zinc-950 selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">

        {/* ── Top Nav Row ── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
            Back to account
          </Link>

          <span className="inline-flex items-center gap-1.5 border-b border-emerald-600 px-1 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-500 dark:text-emerald-500">
            <HeartIcon className="h-4 w-4" strokeWidth={1.5} />
            {total.toLocaleString()} saved
          </span>
        </div>

        {/* ── Flat Typography Header ── */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Saved <span className="font-semibold">Properties.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            All the properties you have saved appear here. Remove them anytime
            from this page or open the detail page to review them again.
          </p>
        </div>

        {error ? (
          <div className="rounded-sm border border-red-200 px-6 py-20 text-center dark:border-red-900/50">
            <ExclamationTriangleIcon
              className="mx-auto mb-6 h-12 w-12 text-zinc-300 dark:text-zinc-700"
              strokeWidth={1}
            />
            <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white">
              Could not load favorites
            </h2>
            <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((v) => v + 1)}
              className="mt-8 inline-flex items-center gap-2 border-b border-emerald-600 pb-1 text-xs font-bold uppercase tracking-widest text-emerald-600 transition-opacity hover:opacity-60 dark:border-emerald-500 dark:text-emerald-500"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : loadingProperties ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {properties.length.toLocaleString()}{" "}
                {properties.length === 1 ? "property" : "properties"} shown.
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-sm border border-dashed border-zinc-300 bg-transparent px-6 py-24 text-center dark:border-zinc-800">
            <HeartIcon
              className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
              strokeWidth={1}
            />
            <h2 className="mt-6 text-2xl font-light tracking-tight text-zinc-900 dark:text-white">
              No saved properties yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-base text-zinc-500 dark:text-zinc-400">
              When you favorite a property, it will show up here.
            </p>
            <Link
              href="/explore"
              className="mt-8 inline-flex items-center justify-center rounded-sm bg-emerald-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              Browse properties
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}