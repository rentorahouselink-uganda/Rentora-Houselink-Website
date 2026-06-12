import { getProperty } from "@/lib/api/properties";
import { BookingForm } from "@/components/booking/BookingForm";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <BookingForm property={property} />
      </div>
    </div>
  );
}