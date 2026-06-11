import { BookingsList } from "@/components/booking/BookingsList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings – Rentora Houselink",
  description:
    "Track and manage your property booking requests on Rentora Houselink.",
};

export default function BookingsPage() {
  return <BookingsList />;
}