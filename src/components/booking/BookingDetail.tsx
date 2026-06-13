"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  MapPinIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { SavedBooking } from "@/types/booking";
import { getBookingById, markBookingCancelled } from "@/lib/bookings-storage";
import { cancelBooking } from "@/lib/api/bookings";
import { formatMoney } from "@/lib/utils";

function billingLabel(cycle?: string | null): string | null {
  if (!cycle) return null;
  const map: Record<string, string> = {
    DAILY: " / day",
    MONTHLY: " / month",
    QUARTERLY: " / quarter",
    FOUR_MONTHS: " / 4 months",
    BIANNUAL: " / 6 months",
    ANNUAL: " / year",
    SEMESTER: " / semester",
  };
  return map[cycle.toUpperCase()] ?? ` / ${cycle.toLowerCase()}`;
}

// ── Confirm cancel dialog ──
function ConfirmCancelDialog({
  cancelling,
  error,
  onConfirm,
  onClose,
}: {
  cancelling: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={!cancelling ? onClose : undefined}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
          Cancel this booking?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          This will send a cancellation request to the landlord. The action cannot be undone.
        </p>
        {error && (
          <div className="mt-4 border-l-2 border-rose-500 dark:border-rose-400 pl-4 py-1">
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-5">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="bg-rose-600 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──
function Skeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="h-4 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="aspect-video animate-pulse bg-zinc-200 dark:bg-zinc-800 lg:col-span-3" />
          <div className="space-y-4 lg:col-span-2">
            {[90, 70, 60, 50, 80].map((w, i) => (
              <div key={i} className="h-4 animate-pulse bg-zinc-200 dark:bg-zinc-800" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──
type Props = { bookingId: string };

export function BookingDetail({ bookingId }: Props) {
  const [booking, setBooking] = useState<SavedBooking | null | undefined>(undefined);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    setBooking(getBookingById(bookingId) ?? null);
  }, [bookingId]);

  async function handleCancel() {
    if (!booking) return;
    if (!booking.cancellationToken) {
      setCancelError("No cancellation token available for this booking.");
      return;
    }

    setCancelling(true);
    setCancelError(null);

    try {
      await cancelBooking(booking.id, booking.cancellationToken);
      markBookingCancelled(booking.id);
      setBooking({ ...booking, isCancelled: true });
      setShowConfirm(false);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  if (booking === undefined) return <Skeleton />;

  if (booking === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white">
            Booking not found.
          </h2>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            This booking may have been removed from your device.
          </p>
          <Link
            href="/bookings"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 border-b border-emerald-600 dark:border-emerald-500 pb-1 hover:opacity-60 transition-opacity"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const date = booking.bookedAt ? new Date(booking.bookedAt) : null;
  const dateStr = date?.toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" }) ?? "Unknown";
  const priceLabel = billingLabel(booking.billingCycle);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">

          {/* Nav */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/bookings"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to My Bookings
            </Link>
            <BookingStatusBadge isCancelled={booking.isCancelled} />
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: image + listing link */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {booking.thumbnailUrl ? (
                  <Image
                    src={booking.thumbnailUrl}
                    alt={booking.propertyTitle}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl">
                    🏠
                  </div>
                )}
              </div>

              <Link
                href={`/properties/${booking.propertyId}`}
                className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 transition hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" strokeWidth={1.5} />
                View Original Listing
              </Link>
            </div>

            {/* Right: details panel */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Title */}
              <div className="flex items-start gap-3">
                <h1 className="flex-1 text-xl font-bold capitalize leading-snug tracking-tight text-zinc-900 dark:text-white">
                  {booking.propertyTitle.toLowerCase()}
                </h1>
                {booking.roomNumber && (
                  <span className="mt-0.5 shrink-0 border border-emerald-600 dark:border-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                    Room {booking.roomNumber}
                  </span>
                )}
              </div>

              {/* Detail rows */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-start gap-3 py-4">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Location</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{booking.location}</p>
                  </div>
                </div>

                {booking.universityName && (
                  <div className="flex items-start gap-3 py-4">
                    <AcademicCapIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Nearest University</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{booking.universityName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 py-4">
                  <CalendarDaysIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Requested On</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{dateStr}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              {booking.price > 0 && (
                <div className="border-l-2 border-emerald-600 dark:border-emerald-500 pl-4 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Price</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {formatMoney(booking.price)}
                    {priceLabel && (
                      <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">{priceLabel}</span>
                    )}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto pt-2">
                {!booking.isCancelled ? (
                  <>
                    {cancelError && (
                      <div className="mb-4 border-l-2 border-rose-500 dark:border-rose-400 pl-4 py-1">
                        <p className="text-sm text-rose-600 dark:text-rose-400">{cancelError}</p>
                      </div>
                    )}
                    <button
                      onClick={() => { setShowConfirm(true); setCancelError(null); }}
                      className="flex w-full items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-900/10"
                    >
                      <XCircleIcon className="h-4 w-4" strokeWidth={1.5} />
                      Cancel Booking Request
                    </button>
                  </>
                ) : (
                  <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 py-2">
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      This booking has been cancelled and is no longer active.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmCancelDialog
          cancelling={cancelling}
          error={cancelError}
          onConfirm={handleCancel}
          onClose={() => { if (!cancelling) { setShowConfirm(false); setCancelError(null); } }}
        />
      )}
    </>
  );
}