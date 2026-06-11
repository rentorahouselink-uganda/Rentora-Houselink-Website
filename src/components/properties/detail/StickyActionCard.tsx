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
      <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        {/* Price */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {property.listingPurpose === "SALE" ? "Purchase Price" : "Rental Price"}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">
              {formatMoney(property.price)}
            </span>
            {property.listingPurpose !== "SALE" && property.billingCycle && (
              <span className="text-lg font-medium text-slate-500">
                {formatBillingCycle(property.billingCycle)}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Rooms</p>
            <p className="mt-1 font-semibold text-slate-900">
              {property.numberOfRooms ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Status</p>
            <p
              className={`mt-1 font-semibold ${
                property.status === "AVAILABLE"
                  ? "text-emerald-600"
                  : "text-slate-900"
              }`}
            >
              {property.status === "AVAILABLE"
                ? "Available Now"
                : formatLabel(property.status)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Parking</p>
            <p className="mt-1 font-semibold text-slate-900">
              {property.parkingAvailable ? "Available" : "None"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Views</p>
            <p className="mt-1 font-semibold text-slate-900">
              {(property.viewCount ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href={bookPath}
            className="block w-full rounded-xl bg-emerald-600 px-6 py-4 text-center text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
          >
            {bookLabel}
          </Link>
          <button
            onClick={() => setShowEnquire(true)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Enquire via WhatsApp
          </button>
        </div>

        {/* Available from date */}
        {property.availableFrom && (
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
            <CalendarDaysIcon className="h-4 w-4" />
            Available from{" "}
            {new Date(property.availableFrom).toLocaleDateString("en-UG", {
              day: "numeric",
              month: "short",
              year: "numeric",
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