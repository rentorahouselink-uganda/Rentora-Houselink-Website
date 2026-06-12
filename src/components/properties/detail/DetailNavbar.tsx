"use client";

import { useState } from "react";
import { ChevronLeftIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export function DetailNavbar() {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="flex items-center justify-between py-2">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ChevronLeftIcon className="h-5 w-5" /> Back to Explore
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isSaved ? (
            <HeartIconSolid className="h-5 w-5 fill-rose-500 text-rose-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <ShareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}