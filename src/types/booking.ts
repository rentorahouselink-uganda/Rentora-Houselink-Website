export type SavedBooking = {
  id: string;
  cancellationToken?: string;
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
  status?: string;
  moveInDate?: string | null;
  moveOutDate?: string | null;
  notes?: string | null;
};

export type BookingFilterTab = "all" | "active" | "cancelled";

export type BookingSyncItem = {
  id: string;
  cancellationToken: string;
};