"use client";

import Link from "next/link";
import { PaginationMeta } from "@/types/pagination";

type PropertyPaginationProps = {
  meta: PaginationMeta;
  searchParams: Record<string, string | string[] | undefined>;
};

function getPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  params.set("page", String(page));
  return `/explore?${params.toString()}`;
}

export function PropertyPagination({
  meta,
  searchParams,
}: PropertyPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      {meta.hasPreviousPage && (
        <Link
          href={getPageHref(searchParams, meta.page - 1)}
          className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors"
        >
          Previous
        </Link>
      )}

      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Page {meta.page} of {meta.totalPages}
      </span>

      {meta.hasNextPage && (
        <Link
          href={getPageHref(searchParams, meta.page + 1)}
          scroll={false}
          className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}