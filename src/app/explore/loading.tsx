export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-12 dark:bg-zinc-950 font-sans [overflow-anchor:none]">
      {/* ── FeaturedBanner Skeleton ── */}
      <div className="h-[440px] w-full animate-pulse bg-zinc-200/50 dark:bg-zinc-900/50 lg:h-[500px] xl:max-h-[600px]" />

      {/* ── Sticky Header + Filters Skeleton ── */}
      <div className="sticky top-16 z-40 border-b border-zinc-200 bg-zinc-50/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pb-6 pt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                {/* Title */}
                <div className="h-10 w-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 sm:w-80" />
                {/* Subtitle */}
                <div className="h-5 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              </div>
              {/* Badge */}
              <div className="h-6 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          <div className="pb-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Search Bar Skeleton */}
              <div className="h-12 w-full max-w-md animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              {/* Sort/Filter Skeleton */}
              <div className="flex gap-6 pb-1">
                <div className="h-6 w-28 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-20 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>

            {/* Category Pills Skeleton */}
            <div className="mt-6 flex gap-2.5 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 shrink-0 animate-pulse border border-zinc-200 bg-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Property Grid Skeleton ── */}
      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Image Area */}
              <div className="aspect-[4/3] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800/80" />
              
              {/* Content Area */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-16 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-8 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                </div>
                
                {/* Price */}
                <div className="mb-3 h-6 w-3/4 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                
                {/* Title */}
                <div className="mb-2 h-4 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                
                {/* Location */}
                <div className="h-3 w-1/2 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                
                {/* Footer Metadata */}
                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <div className="h-3 w-12 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-12 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-12 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}