"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { formatBillingCycle, formatLabel, formatMoney } from "@/lib/utils";
import { EnquireModal } from "./EnquireModal";

export function StickyActionCard({ property }: { property: Property }) {
  const [showEnquire, setShowEnquire] = useState(false);

  const bookPath =
    property.type === "HOSTEL"
      ? `/properties/${property.id}/rooms`
      : `/properties/${property.id}/book`;

  const bookLabel =
    property.type === "HOSTEL" ? "View Available Rooms" : "Book Property Now";

  return (
    <>
      <div className="sticky top-24 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        {/* Price */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {property.listingPurpose === "SALE" ? "Purchase Price" : "Rental Price"}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {formatMoney(property.price)}
            </span>
            {property.listingPurpose !== "SALE" && property.billingCycle && (
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {formatBillingCycle(property.billingCycle)}
              </span>
            )}
          </div>
        </div>

        {/* Minimal stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-md border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Rooms</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
              {property.numberOfRooms ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Status</p>
            <p
              className={`mt-1 text-sm font-semibold ${
                property.status === "AVAILABLE"
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-zinc-900 dark:text-white"
              }`}
            >
              {property.status === "AVAILABLE" ? "Available" : formatLabel(property.status)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Parking</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
              {property.parkingAvailable ? "Yes" : "None"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Views</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
              {(property.viewCount ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href={bookPath}
            className="block w-full rounded-md bg-emerald-600 px-6 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            {bookLabel}
          </Link>
          <button
            onClick={() => setShowEnquire(true)}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-4 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Enquire via WhatsApp
          </button>
        </div>

        {/* Available from date */}
        {property.availableFrom && (
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <CalendarDaysIcon className="h-4 w-4" strokeWidth={1.5} />
            Available from{" "}
            {new Date(property.availableFrom).toLocaleDateString("en-UG", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        )}
      </div>

      {showEnquire && (
        <EnquireModal property={property} onClose={() => setShowEnquire(false)} />
      )}
    </>
  );
}