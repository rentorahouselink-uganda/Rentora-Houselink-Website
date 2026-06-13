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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <BookingForm property={property} />
      </div>
    </div>
  );
}