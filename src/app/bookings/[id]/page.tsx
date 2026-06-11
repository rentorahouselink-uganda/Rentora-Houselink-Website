import { BookingDetail } from "@/components/booking/BookingDetail";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Booking Details – Rentora Houselink",
};

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <BookingDetail bookingId={id} />;
}