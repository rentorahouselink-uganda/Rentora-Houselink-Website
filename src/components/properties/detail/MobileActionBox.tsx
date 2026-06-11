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

  const bookLabel = property.type === "HOSTEL" ? "Rooms" : "Book Now";

  return (
    <>
      {/* Fixed bar — visible only below lg breakpoint */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          {/* Price summary */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-extrabold text-slate-900">
              {formatMoney(property.price)}
            </p>
            <p className="text-xs text-slate-500">
              {property.listingPurpose === "SALE"
                ? "Purchase price"
                : "Rental price"}
            </p>
          </div>

          {/* Enquire */}
          <button
            onClick={() => setShowEnquire(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
            Enquire
          </button>

          {/* Book */}
          <Link
            href={bookPath}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
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