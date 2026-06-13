"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useExplorePending } from "./explore-pending-context";

const categories = [
  { label: "All",                type: "",                 listingPurpose: "" },
  { label: "Rentals",            type: "RESIDENTIAL_HOUSE", listingPurpose: "RENT" },
  { label: "Houses for sale",    type: "RESIDENTIAL_HOUSE", listingPurpose: "SALE" },
  { label: "Apartments",         type: "APARTMENT",         listingPurpose: "" },
  { label: "Hostels",            type: "HOSTEL",            listingPurpose: "" },
  { label: "Hotel / Guest Houses", type: "HOTEL_LODGE",    listingPurpose: "" },
  { label: "Business spaces",    type: "BUSINESS_SPACE",    listingPurpose: "" },
];

const SEARCH_DEBOUNCE_MS = 450;

type PropertyFiltersProps = {
  isCompact?: boolean;
};

export function PropertyFilters({ isCompact = false }: PropertyFiltersProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { isPending, startUpdate } = useExplorePending();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function updateParams(values: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    params.set("page", "1");

    startUpdate(() => {
      router.push(`/explore?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value.trim() || null });
    }, SEARCH_DEBOUNCE_MS);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParams({ search: search.trim() || null });
  }

  function clearSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearch("");
    updateParams({ search: null });
  }

  const activeType    = searchParams.get("type") ?? "";
  const activePurpose = searchParams.get("listingPurpose") ?? "";

  const inputFlushClass =
    "bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none transition-colors focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-0 rounded-none w-full";

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        
        {/* Search Input */}
        <form
          onSubmit={submitSearch}
          className="relative flex w-full items-center group lg:max-w-md"
        >
          {isPending ? (
            <svg
              className="absolute left-0 h-5 w-5 animate-spin text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
          ) : (
            <MagnifyingGlassIcon className="absolute left-0 h-5 w-5 text-zinc-400" strokeWidth={1.5} />
          )}
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by area, district..."
            className={`${inputFlushClass} py-3 pl-8 pr-8 placeholder:text-zinc-400`}
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-0 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Sort & Filters Toggle */}
        <div className="flex items-center gap-6 pb-1">
          <select
            value={`${searchParams.get("sortBy") ?? ""}:${searchParams.get("sortOrder") ?? ""}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(":");
              updateParams({ sortBy: sortBy || null, sortOrder: sortOrder || null });
            }}
            className="bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-800 py-2 pl-0 pr-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 outline-none transition-colors focus:border-emerald-600 focus:text-zinc-900 dark:focus:border-emerald-500 dark:focus:text-white focus:ring-0 rounded-none cursor-pointer"
          >
            <option value=":">Recommended</option>
            <option value="createdAt:DESC">Newest first</option>
            <option value="price:ASC">Lowest price</option>
            <option value="price:DESC">Highest price</option>
          </select>

          <button
            type="button"
            className="flex items-center gap-2 border-b border-zinc-900 dark:border-white py-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:opacity-60 transition-opacity"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div
        className={[
          "no-scrollbar overflow-hidden transition-all duration-300 ease-in-out",
          isCompact ? "max-h-0 opacity-0" : "max-h-20 opacity-100 mt-8",
        ].join(" ")}
      >
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const isActive =
              activeType === cat.type && activePurpose === cat.listingPurpose;
            return (
              <button
                key={`${cat.label}-${cat.type}-${cat.listingPurpose}`}
                type="button"
                onClick={() =>
                  updateParams({
                    type:           cat.type || null,
                    listingPurpose: cat.listingPurpose || null,
                  })
                }
                className={[
                  "shrink-0 rounded-none border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200",
                  isActive
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white",
                ].join(" ")}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}