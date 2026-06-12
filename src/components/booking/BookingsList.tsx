"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ReceiptRefundIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { BookingCard } from "./BookingCard";
import type { SavedBooking, BookingFilterTab } from "@/types/booking";
import { getAllBookings, markBookingCancelled } from "@/lib/bookings-storage";
import {
  cancelBooking,
  cancelMyBooking,
  getMyBookings,
} from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/auth-context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

// ── Filter tab pill ──
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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-slate-900 text-white dark:bg-emerald-600"
          : "border-slate-200 bg-transparent text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
          active
            ? "bg-white/25 text-white"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// ── Skeleton ──
function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 flex gap-2">
          {[80, 70, 90].map((w, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function sortBookings(bookings: SavedBooking[]): SavedBooking[] {
  return [...bookings].sort((a, b) => {
    const aTime = new Date(a.bookedAt).getTime();
    const bTime = new Date(b.bookedAt).getTime();
    return bTime - aTime;
  });
}

function mergeBookings(
  serverBookings: SavedBooking[],
  guestBookings: SavedBooking[],
): SavedBooking[] {
  const seen = new Set<string>();
  const merged: SavedBooking[] = [];

  for (const booking of [...guestBookings, ...serverBookings]) {
    if (seen.has(booking.id)) continue;
    seen.add(booking.id);
    merged.push(booking);
  }

  return sortBookings(merged);
}

// ── Main component ──
export function BookingsList() {
  const { isAuthenticated, isLoading, token, isSyncingGuestBookings } = useAuth();

  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [filter, setFilter] = useState<BookingFilterTab>("all");
  const [mounted, setMounted] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [pendingCancel, setPendingCancel] = useState<SavedBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;

    async function load() {
      setLoadingBookings(true);

      try {
        if (isAuthenticated && token) {
          if (isSyncingGuestBookings) return;

          const serverBookings = await getMyBookings(token);
          const guestBookings = getAllBookings();
          const merged = mergeBookings(serverBookings, guestBookings);

          if (!cancelled) {
            setBookings(merged);
          }
        } else {
          const guestBookings = sortBookings(getAllBookings());
          if (!cancelled) {
            setBookings(guestBookings);
          }
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);

        if (!cancelled) {
          if (isAuthenticated && token) {
            const guestBookings = sortBookings(getAllBookings());
            setBookings(guestBookings);
          } else {
            setBookings([]);
          }
        }
      } finally {
        if (!cancelled) setLoadingBookings(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, isSyncingGuestBookings, token]);

  const handleCancelConfirm = useCallback(async () => {
    if (!pendingCancel) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      if (pendingCancel.cancellationToken) {
        await cancelBooking(
          pendingCancel.id,
          pendingCancel.cancellationToken,
        );
        markBookingCancelled(pendingCancel.id);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === pendingCancel.id ? { ...b, isCancelled: true } : b,
          ),
        );
      } else {
        if (!token) throw new Error("Not authenticated");
        const updated = await cancelMyBooking(
          pendingCancel.id,
          token,
        );

        setBookings((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b)),
        );
      }

      setPendingCancel(null);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  }, [pendingCancel, token]);

  if (!mounted || isLoading || loadingBookings || isSyncingGuestBookings) {
    return <Skeleton />;
  }

  const activeCount = bookings.filter((b) => !b.isCancelled).length;
  const cancelledCount = bookings.filter((b) => b.isCancelled).length;

  const filtered = bookings.filter((b) => {
    if (filter === "active") return !b.isCancelled;
    if (filter === "cancelled") return b.isCancelled;
    return true;
  });

  const isGuestView = !isAuthenticated;

  // Format the modal description safely handling empty states
  const cancelDescription = cancelError 
    ? `Error: ${cancelError}` 
    : `Are you sure you want to cancel your request for ${pendingCancel?.propertyTitle?.toLowerCase()}? This action cannot be undone.`;

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                {isGuestView ? "My Booking Requests" : "My Bookings"}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isGuestView
                  ? "Track and manage your guest booking requests."
                  : "Track and manage your property booking requests."}
              </p>
            </div>
            <Link
              href="/explore"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Explore Properties
            </Link>
          </div>

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

          <div className="mt-6">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <ReceiptRefundIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="mt-5 text-lg font-extrabold text-slate-800 dark:text-white">
                  No bookings yet
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
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

      <ConfirmModal
        isOpen={!!pendingCancel}
        onClose={() => {
          if (!isCancelling) {
            setPendingCancel(null);
            setCancelError(null);
          }
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking?"
        description={cancelDescription}
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        isLoading={isCancelling}
        isDanger={true}
        icon={<XCircleIcon className="h-6 w-6" strokeWidth={2} />}
      />
    </>
  );
}