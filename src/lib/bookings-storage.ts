import type { BookingSyncItem, SavedBooking } from "@/types/booking";

const STORAGE_KEY = "rentora_saved_bookings";

/** Guard: localStorage is unavailable during SSR */
function canUse(): boolean {
  return typeof window !== "undefined";
}

function readBookings(): SavedBooking[] {
  if (!canUse()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed as SavedBooking[];
  } catch {
    return [];
  }
}

function writeBookings(bookings: SavedBooking[]): void {
  if (!canUse()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getGuestBookings(): SavedBooking[] {
  return readBookings();
}

export function getAllBookings(): SavedBooking[] {
  return getGuestBookings();
}

export function getBookingById(id: string): SavedBooking | null {
  return readBookings().find((b) => b.id === id) ?? null;
}

export function getGuestBookingSyncPayload(): BookingSyncItem[] {
  return readBookings()
    .filter((booking) => Boolean(booking.cancellationToken))
    .map((booking) => ({
      id: booking.id,
      cancellationToken: booking.cancellationToken as string,
    }));
}

export function hasGuestBookings(): boolean {
  return readBookings().length > 0;
}

export function upsertBooking(booking: SavedBooking): void {
  if (!canUse()) return;

  const others = readBookings().filter((b) => b.id !== booking.id);
  writeBookings([booking, ...others]);
}

export function markBookingCancelled(id: string): void {
  if (!canUse()) return;

  const updated = readBookings().map((b) =>
    b.id === id ? { ...b, isCancelled: true } : b,
  );
  writeBookings(updated);
}

export function removeBooking(id: string): void {
  if (!canUse()) return;

  const updated = readBookings().filter((b) => b.id !== id);
  writeBookings(updated);
}

export function clearGuestBookings(): void {
  if (!canUse()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function clearAllBookings(): void {
  clearGuestBookings();
}