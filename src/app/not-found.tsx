"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-6 z-50">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500/20" />
      
      <div className="max-w-2xl w-full">
        {/* 404 number - architectural typography */}
        <div className="mb-8 text-center">
          <div className="text-[15rem] font-light leading-none tracking-tighter text-zinc-900 dark:text-zinc-100 select-none">
            404
          </div>
          <div className="w-16 h-px bg-emerald-500 mt-2 mx-auto" />
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12 text-center">
          <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            This page could not be found.
          </h1>
          <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Check the URL or return to the homepage.
          </p>
        </div>

        {/* Actions - centered */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm font-medium tracking-wide text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-sm"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
            GO BACK
          </button>
          
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-emerald-500 bg-transparent text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white dark:hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-sm"
          >
            <HomeIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.5} />
            RETURN HOME
          </Link>
        </div>
      </div>

      {/* Subtle footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 dark:text-zinc-600 uppercase">
          Rentora HouseLink UG
        </p>
      </div>
    </div>
  );
}