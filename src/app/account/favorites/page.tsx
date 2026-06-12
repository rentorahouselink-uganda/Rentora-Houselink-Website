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
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const total = favoriteIdList.length;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        
        {/* ── Top Nav Row ── */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
            Back to account
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <HeartIcon className="h-4 w-4" strokeWidth={2} />
            {total.toLocaleString()} saved
          </span>
        </div>

        {/* ── Flat Typography Header ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Saved Properties
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            All the properties you have saved appear here. Remove them anytime
            from this page or open the detail page to review them again.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400" strokeWidth={1.5} />
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400">
              Could not load favorites
            </h2>
            <p className="mt-2 text-base text-red-600 dark:text-red-300">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((v) => v + 1)}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Retry
            </button>
          </div>
        ) : loadingProperties ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {properties.length.toLocaleString()}{" "}
                {properties.length === 1 ? "property" : "properties"} shown.
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-transparent px-6 py-24 text-center dark:border-slate-800">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
              <HeartIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
              No saved properties yet
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              When you favorite a property, it will show up here.
            </p>
            <Link
              href="/explore"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
            >
              Browse properties
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}