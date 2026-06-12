"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { SavedBooking } from "@/types/booking";
import { formatMoney, formatBillingCycle } from "@/lib/utils";

type Props = {
  booking: SavedBooking;
  onCancel: (booking: SavedBooking) => void;
};

export function BookingCard({ booking, onCancel }: Props) {
  const date = booking.bookedAt ? new Date(booking.bookedAt) : null;
  const dateStr = date
    ? date.toLocaleDateString("en-UG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

  return (
    <div className="group flex overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition hover:border-emerald-400 dark:hover:border-emerald-600">
      {/* Thumbnail — hidden on the smallest screens */}
      <div className="relative hidden w-44 shrink-0 sm:block">
        {booking.thumbnailUrl ? (
          <Image
            src={booking.thumbnailUrl}
            alt={booking.propertyTitle}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="176px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-3xl">
            🏠
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + meta */}
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-extrabold capitalize text-slate-900 dark:text-white">
              {booking.propertyTitle.toLowerCase()}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                {booking.location}
              </span>
              {booking.universityName && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <AcademicCapIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                  {booking.universityName}
                  {booking.roomNumber ? ` · Room ${booking.roomNumber}` : ""}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                Requested {dateStr}
              </span>
            </div>
          </div>

          {/* Right: status badge */}
          <div className="shrink-0">
            <BookingStatusBadge isCancelled={booking.isCancelled} />
          </div>
        </div>

        {/* Footer: price + actions */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          {booking.price > 0 ? (
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {formatMoney(booking.price)}
              {booking.billingCycle && (
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  {formatBillingCycle(booking.billingCycle)}
                </span>
              )}
            </p>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            {!booking.isCancelled && (
              <button
                onClick={() => onCancel(booking)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Cancel
              </button>
            )}
            <Link
              href={`/bookings/${booking.id}`}
              className="rounded-lg bg-slate-900 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:hover:bg-slate-700"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}