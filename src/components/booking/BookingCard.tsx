"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  HomeModernIcon,
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
    <div className="group flex overflow-hidden rounded-md border border-zinc-200 bg-white transition hover:border-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500">
      {/* Thumbnail */}
      <div className="relative hidden w-40 shrink-0 sm:block">
        {booking.thumbnailUrl ? (
          <Image
            src={booking.thumbnailUrl}
            alt={booking.propertyTitle}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="160px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <HomeModernIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-600" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + meta */}
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-bold capitalize text-zinc-900 dark:text-white">
              {booking.propertyTitle.toLowerCase()}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
                {booking.location}
              </span>
              {booking.universityName && (
                <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <AcademicCapIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
                  {booking.universityName}
                  {booking.roomNumber ? ` · Room ${booking.roomNumber}` : ""}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
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
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
          {booking.price > 0 ? (
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              {formatMoney(booking.price)}
              {booking.billingCycle && (
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
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
                className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              >
                Cancel
              </button>
            )}
            <Link
              href={`/bookings/${booking.id}`}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}