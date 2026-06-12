"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { formatMoney } from "@/lib/utils";
import { EnquireModal } from "./EnquireModal";

export function MobileActionBox({ property }: { property: Property }) {
  const [showEnquire, setShowEnquire] = useState(false);

  const bookPath =
    property.type === "HOSTEL"
      ? `/properties/${property.id}/rooms`
      : `/properties/${property.id}/book`;

  const bookLabel = property.type === "HOSTEL" ? "Rooms" : "Book";

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-extrabold text-slate-900 dark:text-white">
              {formatMoney(property.price)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {property.listingPurpose === "SALE" ? "Purchase price" : "Rental price"}
            </p>
          </div>

          <button
            onClick={() => setShowEnquire(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
            Enquire
          </button>

          <Link
            href={bookPath}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            {bookLabel}
          </Link>
        </div>
      </div>

      {showEnquire && (
        <EnquireModal property={property} onClose={() => setShowEnquire(false)} />
      )}
    </>
  );
}