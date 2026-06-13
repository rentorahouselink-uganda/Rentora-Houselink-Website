"use client";

import Link from "next/link";
import { PaginationMeta } from "@/types/pagination";

type PropertyPaginationProps = {
  meta: PaginationMeta;
  searchParams: Record<string, string | string[] | undefined>;
};

function getPageHref(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => { if (typeof value === "string" && value) params.set(key, value); });
  params.set("page", String(page));
  return `/explore?${params.toString()}`;
}

export function PropertyPagination({ meta, searchParams }: PropertyPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      {meta.hasPreviousPage && (
        <Link 
          href={getPageHref(searchParams, meta.page - 1)} 
          className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-100 hover:text-emerald-600 dark:text-white dark:hover:bg-zinc-800/50 dark:hover:text-emerald-500 transition-all"
        >
          Previous
        </Link>
      )}
      <span className="text-xs font-medium text-zinc-400">Page {meta.page} of {meta.totalPages}</span>
      {meta.hasNextPage && (
        <Link 
          href={getPageHref(searchParams, meta.page + 1)} 
          scroll={false} 
          className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-100 hover:text-emerald-600 dark:text-white dark:hover:bg-zinc-800/50 dark:hover:text-emerald-500 transition-all"
        >
          Next
        </Link>
      )}
    </div>
  );
}