export type SavedBooking = {
  id: string;
  cancellationToken: string;
  propertyId: string;
  propertyTitle: string;
  price: number;
  location: string;
  billingCycle?: string | null;
  universityName?: string | null;
  thumbnailUrl?: string | null;
  roomNumber?: string | null;
  bookedAt: string; // ISO 8601
  isCancelled: boolean;
};

export type BookingFilterTab = "all" | "active" | "cancelled";