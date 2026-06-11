import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyPagination } from "@/components/properties/PropertyPagination";
import { FeaturedBanner } from "@/components/properties/FeaturedBanner";
import { PaginationMeta } from "@/types/pagination";
import { Property } from "@/types/property";

type ExplorePageProps = {
  properties: Property[];
  meta: PaginationMeta;
  searchParams: Record<string, string | string[] | undefined>;
  featuredProperties: Property[];
};

export function ExplorePage({
  properties,
  meta,
  searchParams,
  featuredProperties,
}: ExplorePageProps) {
  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      {/* ── 1. Featured Banner (Moved to top for a true Hero feel) ── */}
      {featuredProperties.length > 0 && (
        <FeaturedBanner properties={featuredProperties} />
      )}

      {/* ── 2. Unified Header & Sticky Filters ── */}
      <div className="sticky top-16 z-20 border-b border-slate-200 bg-white/80 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Explore properties
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Find available rentals and homes with verified details.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {meta.total.toLocaleString()} listings found
            </div>
          </div>
          
          <PropertyFilters />
        </div>
      </div>

      {/* ── 3. Property Grid ── */}
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {properties.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-10">
              <PropertyPagination meta={meta} searchParams={searchParams} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              No matching properties
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search, category, or price filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}