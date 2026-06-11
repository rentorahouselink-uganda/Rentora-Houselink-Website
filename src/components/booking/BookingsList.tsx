"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ReceiptRefundIcon } from "@heroicons/react/24/outline";
import { BookingCard } from "./BookingCard";
import type { SavedBooking, BookingFilterTab } from "@/types/booking";
import { getAllBookings, markBookingCancelled } from "@/lib/bookings-storage";
import { cancelBooking } from "@/lib/api/bookings";

// ── Filter tab pill ────────────────────────────────────────────────────────────

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
          active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// ── Confirmation dialog ────────────────────────────────────────────────────────

function CancelDialog({
  booking,
  isCancelling,
  error,
  onConfirm,
  onClose,
}: {
  booking: SavedBooking;
  isCancelling: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isCancelling ? onClose : undefined}
      />
      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-extrabold text-slate-900">Cancel Booking?</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Are you sure you want to cancel your request for{" "}
          <span className="font-semibold capitalize">
            {booking.propertyTitle.toLowerCase()}
          </span>
          ? This action cannot be undone.
        </p>
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isCancelling ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-8 flex gap-2">
          {[80, 70, 90].map((w, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-full bg-slate-200"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────

export function BookingsList() {
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [filter, setFilter] = useState<BookingFilterTab>("all");
  const [mounted, setMounted] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<SavedBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Read from localStorage only after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setBookings(getAllBookings());
    setMounted(true);
  }, []);

  const handleCancelConfirm = useCallback(async () => {
    if (!pendingCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelBooking(pendingCancel.id, pendingCancel.cancellationToken);
      markBookingCancelled(pendingCancel.id);
      setBookings(getAllBookings());
      setPendingCancel(null);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  }, [pendingCancel]);

  if (!mounted) return <Skeleton />;

  const activeCount = bookings.filter((b) => !b.isCancelled).length;
  const cancelledCount = bookings.filter((b) => b.isCancelled).length;

  const filtered = bookings.filter((b) => {
    if (filter === "active") return !b.isCancelled;
    if (filter === "cancelled") return b.isCancelled;
    return true;
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          {/* ── Page header ── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                My Bookings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track and manage your property booking requests.
              </p>
            </div>
            <Link
              href="/explore"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Explore Properties
            </Link>
          </div>

          {/* ── Filter row ── */}
          {bookings.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              <FilterPill
                label="All"
                count={bookings.length}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterPill
                label="Active"
                count={activeCount}
                active={filter === "active"}
                onClick={() => setFilter("active")}
              />
              <FilterPill
                label="Cancelled"
                count={cancelledCount}
                active={filter === "cancelled"}
                onClick={() => setFilter("cancelled")}
              />
            </div>
          )}

          {/* ── Content ── */}
          <div className="mt-6">
            {bookings.length === 0 ? (
              // Completely empty state
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <ReceiptRefundIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="mt-5 text-lg font-extrabold text-slate-800">
                  No bookings yet
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  Your property booking requests will appear here once you submit one.
                </p>
                <Link
                  href="/explore"
                  className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Browse Properties
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              // Filter yields no results
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No {filter} bookings to show.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => {
                      setPendingCancel(b);
                      setCancelError(null);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancel dialog ── */}
      {pendingCancel && (
        <CancelDialog
          booking={pendingCancel}
          isCancelling={isCancelling}
          error={cancelError}
          onConfirm={handleCancelConfirm}
          onClose={() => {
            if (!isCancelling) {
              setPendingCancel(null);
              setCancelError(null);
            }
          }}
        />
      )}
    </>
  );
}