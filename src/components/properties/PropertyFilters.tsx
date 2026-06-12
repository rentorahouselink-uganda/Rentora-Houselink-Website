"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const categories = [
  { label: "All",                type: "",                 listingPurpose: "" },
  { label: "Rentals",            type: "RESIDENTIAL_HOUSE", listingPurpose: "RENT" },
  { label: "Houses for sale",    type: "RESIDENTIAL_HOUSE", listingPurpose: "SALE" },
  { label: "Apartments",         type: "APARTMENT",         listingPurpose: "" },
  { label: "Hostels",            type: "HOSTEL",            listingPurpose: "" },
  { label: "Hotel / Guest Houses", type: "HOTEL_LODGE",    listingPurpose: "" },
  { label: "Business spaces",    type: "BUSINESS_SPACE",    listingPurpose: "" },
];

type PropertyFiltersProps = {
  isCompact?: boolean;
};

export function PropertyFilters({ isCompact = false }: PropertyFiltersProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParams(values: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    params.set("page", "1");
    router.push(`/explore?${params.toString()}`, { scroll: false });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({ search: search.trim() || null });
  }

  const activeType    = searchParams.get("type") ?? "";
  const activePurpose = searchParams.get("listingPurpose") ?? "";

  return (
    <div>
      {/* Search + Sort + Filters row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form
          onSubmit={submitSearch}
          className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 lg:max-w-md"
        >
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by area, district..."
            className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            defaultValue={`${searchParams.get("sortBy") ?? ""}:${searchParams.get("sortOrder") ?? ""}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(":");
              updateParams({ sortBy: sortBy || null, sortOrder: sortOrder || null });
            }}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">Recommended</option>
            <option value="createdAt:DESC">Newest first</option>
            <option value="price:ASC">Lowest price</option>
            <option value="price:DESC">Highest price</option>
          </select>

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Category pills — collapse in compact mode */}
      <div
        className={[
          "no-scrollbar overflow-hidden transition-all duration-300 ease-in-out",
          isCompact ? "max-h-0 opacity-0" : "max-h-16 opacity-100 mt-4",
        ].join(" ")}
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
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
                  "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors duration-200",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white",
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