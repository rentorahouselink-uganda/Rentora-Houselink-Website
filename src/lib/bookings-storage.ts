import type { SavedBooking } from "@/types/booking";

const STORAGE_KEY = "rentora_saved_bookings";

/** Guard: localStorage is unavailable during SSR */
function canUse(): boolean {
  return typeof window !== "undefined";
}

export function getAllBookings(): SavedBooking[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedBooking[];
  } catch {
    return [];
  }
}

export function getBookingById(id: string): SavedBooking | null {
  return getAllBookings().find((b) => b.id === id) ?? null;
}

export function upsertBooking(booking: SavedBooking): void {
  if (!canUse()) return;
  const others = getAllBookings().filter((b) => b.id !== booking.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...others]));
}

export function markBookingCancelled(id: string): void {
  if (!canUse()) return;
  const updated = getAllBookings().map((b) =>
    b.id === id ? { ...b, isCancelled: true } : b,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllBookings(): void {
  if (!canUse()) return;
  localStorage.removeItem(STORAGE_KEY);
}