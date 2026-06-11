const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://rentora-api.duckdns.org/api/v1";

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
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Failed to submit booking request.",
    );
  }

  return res.json() as Promise<CreateBookingResponse>;
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
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Failed to cancel booking.",
    );
  }
}