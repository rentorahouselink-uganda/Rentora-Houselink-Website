"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ReceiptRefundIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { BookingCard } from "./BookingCard";
import type { SavedBooking, BookingFilterTab } from "@/types/booking";
import { getAllBookings, markBookingCancelled } from "@/lib/bookings-storage";
import { cancelBooking, cancelMyBooking, getMyBookings } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/auth-context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

// ── Filter chip ──
function FilterChip({
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
        "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors",
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950"
          : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "text-[10px] font-bold",
          active
            ? "text-white/60 dark:text-zinc-950/60"
            : "text-zinc-400 dark:text-zinc-600",
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-52 rounded-md animate-pulse bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-72 rounded-md animate-pulse bg-zinc-100 dark:bg-zinc-900" />
        <div className="mt-8 flex gap-3">
          {[80, 70, 90].map((w, i) => (
            <div key={i} className="h-9 rounded-md animate-pulse bg-zinc-200 dark:bg-zinc-800" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-md animate-pulse bg-zinc-200 dark:bg-zinc-800" />
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
        await cancelBooking(pendingCancel.id, pendingCancel.cancellationToken);
        markBookingCancelled(pendingCancel.id);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === pendingCancel.id ? { ...b, isCancelled: true } : b,
          ),
        );
      } else {
        if (!token) throw new Error("Not authenticated");
        const updated = await cancelMyBooking(pendingCancel.id, token);
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

  const cancelDescription = cancelError
    ? `Error: ${cancelError}`
    : `Are you sure you want to cancel your request for ${pendingCancel?.propertyTitle?.toLowerCase()}? This action cannot be undone.`;

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                {isGuestView ? "My Booking Requests" : "My Bookings"}
              </h1>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                {isGuestView
                  ? "Track and manage your guest booking requests."
                  : "Track and manage your property booking requests."}
              </p>
            </div>
            <Link
              href="/explore"
              className="rounded-md bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              Explore Properties
            </Link>
          </div>

          {bookings.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              <FilterChip
                label="All"
                count={bookings.length}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterChip
                label="Active"
                count={activeCount}
                active={filter === "active"}
                onClick={() => setFilter("active")}
              />
              <FilterChip
                label="Cancelled"
                count={cancelledCount}
                active={filter === "cancelled"}
                onClick={() => setFilter("cancelled")}
              />
            </div>
          )}

          <div className="mt-8">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 px-6 py-24 text-center">
                <ReceiptRefundIcon className="mb-6 h-12 w-12 text-zinc-300 dark:text-zinc-700" strokeWidth={1} />
                <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white mb-2">
                  No bookings yet.
                </h2>
                <p className="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 mb-8">
                  Your property booking requests will appear here once you submit one.
                </p>
                <Link
                  href="/explore"
                  className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 border-b border-emerald-600 dark:border-emerald-500 pb-1 hover:opacity-60 transition-opacity"
                >
                  Browse Properties
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
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