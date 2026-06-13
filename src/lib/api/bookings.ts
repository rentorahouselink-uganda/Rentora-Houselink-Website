import type { BookingSyncItem, SavedBooking } from "@/types/booking";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.rentorahouselink.com/api/v1";

export type CreateBookingRequest = {
  renterName: string;
  renterPhone: string;
  renterEmail?: string;
  propertyId: string;
  hostelRoomId?: string;
  moveInDate: string; // yyyy-MM-dd
  notes?: string;
};

export type CreateBookingResponse = {
  id: string;
  status: string;
  cancellationToken: string;
};

type RawBookingResponse = Partial<SavedBooking> & {
  id: string;
  propertyTitle: string;
  propertyId: string;
  price: number | string;
  location: string;
  bookedAt: string;
  isCancelled?: boolean;
  status?: string;
};

function normalizeBooking(raw: RawBookingResponse): SavedBooking {
  return {
    id: raw.id,
    cancellationToken: raw.cancellationToken,
    propertyId: raw.propertyId,
    propertyTitle: raw.propertyTitle,
    price:
      typeof raw.price === "string" ? Number(raw.price || 0) : raw.price ?? 0,
    location: raw.location,
    billingCycle: raw.billingCycle ?? null,
    universityName: raw.universityName ?? null,
    thumbnailUrl: raw.thumbnailUrl ?? null,
    roomNumber: raw.roomNumber ?? null,
    bookedAt: raw.bookedAt,
    isCancelled: Boolean(raw.isCancelled),
    status: raw.status,
    moveInDate: raw.moveInDate ?? null,
    moveOutDate: raw.moveOutDate ?? null,
    notes: raw.notes ?? null,
  };
}

async function readErrorMessage(response: Response, fallback: string) {
  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  return typeof body.message === "string" ? body.message : fallback;
}

export async function createBooking(
  data: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(
      await readErrorMessage(res, "Failed to submit booking request."),
    );
  }

  return res.json() as Promise<CreateBookingResponse>;
}

export async function getMyBookings(token: string): Promise<SavedBooking[]> {
  const res = await fetch(`${API_BASE_URL}/bookings/me`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Failed to load bookings."));
  }

  const body = (await res.json()) as unknown;

  if (!Array.isArray(body)) return [];
  return body.map((item) => normalizeBooking(item as RawBookingResponse));
}

export async function syncGuestBookings(
  token: string,
  bookings: BookingSyncItem[],
): Promise<{ synced: number }> {
  if (bookings.length === 0) return { synced: 0 };

  const res = await fetch(`${API_BASE_URL}/bookings/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookings }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Failed to sync bookings."));
  }

  return res.json() as Promise<{ synced: number }>;
}

export async function cancelBooking(
  id: string,
  token: string,
  reason?: string,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel-by-renter`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      cancellationToken: token,
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Failed to cancel booking."));
  }
}

export async function cancelMyBooking(
  id: string,
  token: string,
  reason?: string,
): Promise<SavedBooking> {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel-mine`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(
      await readErrorMessage(res, "Failed to cancel booking."),
    );
  }

  const body = (await res.json()) as RawBookingResponse;
  return normalizeBooking(body);
}