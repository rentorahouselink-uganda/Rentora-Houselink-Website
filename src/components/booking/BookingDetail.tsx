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

function ConfirmCancelDialog({ cancelling, error, onConfirm, onClose }: { cancelling: boolean; error: string | null; onConfirm: () => void; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={!cancelling ? onClose : undefined}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
          Cancel this booking?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          This will send a cancellation request to the landlord. The action cannot be undone.
        </p>
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="h-5 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="aspect-video animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 lg:col-span-3" />
          <div className="space-y-4 lg:col-span-2">
            {[90, 70, 60, 50, 80].map((w, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" style={{ width: `${w}%` }} />
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center">
          <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
            Booking not found
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This booking may have been removed from your device.
          </p>
          <Link
            href="/bookings"
            className="mt-5 inline-block rounded-xl bg-slate-900 dark:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
          
          {/* ── Fixed: Clean, inline navigation replaces the double header ── */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to My Bookings
            </Link>
            <BookingStatusBadge isCancelled={booking.isCancelled} />
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* ── Left column: image + listing link ── */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-400 dark:hover:border-emerald-600"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                View Original Listing
              </Link>
            </div>

            {/* ── Right column: details panel ── */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <div>
                <div className="flex items-start gap-3">
                  <h1 className="flex-1 text-xl font-extrabold capitalize leading-snug text-slate-900 dark:text-white">
                    {booking.propertyTitle.toLowerCase()}
                  </h1>
                  {booking.roomNumber && (
                    <span className="mt-0.5 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Room {booking.roomNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Detail cards */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Location</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{booking.location}</p>
                  </div>
                </div>

                {booking.universityName && (
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <AcademicCapIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Nearest University</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{booking.universityName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <CalendarDaysIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Requested On</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{dateStr}</p>
                  </div>
                </div>

                {booking.price > 0 && (
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-500">Price</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                      {formatMoney(booking.price)}
                      {priceLabel && <span className="text-sm font-normal text-emerald-600 dark:text-emerald-500">{priceLabel}</span>}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-2">
                {!booking.isCancelled ? (
                  <>
                    {cancelError && (
                      <p className="mb-3 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                        {cancelError}
                      </p>
                    )}
                    <button
                      onClick={() => { setShowConfirm(true); setCancelError(null); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Cancel Booking Request
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
        <ConfirmCancelDialog cancelling={cancelling} error={cancelError} onConfirm={handleCancel} onClose={() => { if (!cancelling) { setShowConfirm(false); setCancelError(null); } }} />
      )}
    </>
  );
}