import { getProperty } from "@/lib/api/properties";
import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const property = await getProperty(id);
    return <PropertyDetailView property={property} />;
  } catch (error) {
    // If 404 or fetch fails, trigger Next.js not-found page
    notFound();
  }
}