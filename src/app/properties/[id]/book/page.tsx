import { getProperty } from "@/lib/api/properties";
import { BookingForm } from "@/components/booking/BookingForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;

  let property;
  try {
    property = await getProperty(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal navigation bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={`/properties/${id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to listing
          </Link>
          <span className="text-sm font-semibold text-slate-900">
            {property.type === "HOSTEL" ? "Request a Room" : "Book Property"}
          </span>
        </div>
      </div>

      {/* Form container — constrained to readable width */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
        <BookingForm property={property} />
      </div>
    </div>
  );
}