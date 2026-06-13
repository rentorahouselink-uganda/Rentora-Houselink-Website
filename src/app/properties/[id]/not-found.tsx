"use client";

import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-8xl font-light tracking-tighter text-zinc-900 dark:text-zinc-100 mb-4">
          🏠
        </div>
        <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Property not found
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          The property you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/properties"
          className="inline-block px-5 py-2 border border-emerald-500 text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
        >
          BROWSE PROPERTIES
        </Link>
      </div>
    </div>
  );
}