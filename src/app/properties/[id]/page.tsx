import { Metadata } from "next";
import { getProperty } from "@/lib/api/properties";
import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";
import { notFound } from "next/navigation";
import { getPropertyImage, getPropertyLocation, formatMoney } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

// ── Dynamic SEO Metadata Function ──────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const property = await getProperty(id);
    if (!property) return {};

    const location = getPropertyLocation(property) || "Uganda";
    const priceFormatted = formatMoney(property.price);
    const purposeLabel = property.listingPurpose === "SALE" ? "For Sale" : "For Rent";
    
    const seoTitle = `${property.title} | ${priceFormatted} ${purposeLabel}`;
    const seoDescription = `Explore this premium property listing located in ${location}. View absolute structural pricing, features, and check real-time booking availability on Rentora Houselink UG.`;
    const propertyImageUrl = getPropertyImage(property) || "/og-image.jpg";
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentorahouselink.com";

    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: `${siteUrl}/properties/${id}`,
        type: "website",
        images: [{ url: propertyImageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [propertyImageUrl],
      },
    };
  } catch (error) {
    return { title: "Property Listing | Rentora Houselink UG" };
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const property = await getProperty(id);
    return <PropertyDetailView property={property} />;
  } catch (error) {
    notFound();
  }
}