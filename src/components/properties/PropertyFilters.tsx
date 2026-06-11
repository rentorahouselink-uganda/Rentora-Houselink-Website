"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Categories mapped strictly to backend enums
const categories = [
  { label: "All", type: "", listingPurpose: "" },
  { label: "Rentals", type: "RESIDENTIAL_HOUSE", listingPurpose: "RENT" },
  { label: "Houses for sale", type: "RESIDENTIAL_HOUSE", listingPurpose: "SALE" },
  { label: "Apartments", type: "APARTMENT", listingPurpose: "" },
  { label: "Hostels", type: "HOSTEL", listingPurpose: "" },
  { label: "Hotel / Guest Houses", type: "HOTEL_LODGE", listingPurpose: "" }, 
  { label: "Business spaces", type: "BUSINESS_SPACE", listingPurpose: "" }, 
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParams(values: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    params.set("page", "1");
    
    // ── FIXED: Added { scroll: false } to prevent jumping to the top ──
    router.push(`/explore?${params.toString()}`, { scroll: false });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({ search: search.trim() || null });
  }

  const activeType = searchParams.get("type") ?? "";
  const activePurpose = searchParams.get("listingPurpose") ?? "";

  return (
    <section className="sticky top-16 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <form
            onSubmit={submitSearch}
            className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 lg:max-w-md"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by area, district..."
              className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </form>

          {/* Dropdowns & Buttons */}
          <div className="flex items-center gap-3">
            <select
              defaultValue={`${searchParams.get("sortBy") ?? ""}:${searchParams.get("sortOrder") ?? ""}`}
              onChange={(event) => {
                const [sortBy, sortOrder] = event.target.value.split(":");
                updateParams({
                  sortBy: sortBy || null,
                  sortOrder: sortOrder || null,
                });
              }}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Recommended</option>
              <option value="createdAt:DESC">Newest first</option>
              <option value="price:ASC">Lowest price</option>
              <option value="price:DESC">Highest price</option>
            </select>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const isActive =
              activeType === category.type &&
              activePurpose === category.listingPurpose;

            return (
              <button
                key={`${category.label}-${category.type}-${category.listingPurpose}`}
                type="button"
                onClick={() =>
                  updateParams({
                    type: category.type || null,
                    listingPurpose: category.listingPurpose || null,
                  })
                }
                className={[
                  "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors duration-200",
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
                ].join(" ")}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}