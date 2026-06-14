import { Metadata } from "next";
import { getProperty } from "@/lib/api/properties";
import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";
import { notFound } from "next/navigation";
import { getPropertyImage, getPropertyLocation, formatMoney } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

const SITE_NAME = "Rentora Houselink Uganda";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorahouselink.com";

// ── Dynamic SEO Metadata ─────────────────────────────────────────────────────
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

    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: `${SITE_URL}/properties/${id}`,
        siteName: SITE_NAME, // ✅ Added — was missing before
        type: "website",
        images: [{ url: propertyImageUrl, width: 1200, height: 630, alt: seoTitle }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [propertyImageUrl],
      },
    };
  } catch {
    return { title: `Property Listing | ${SITE_NAME}` };
  }
}

// ── Page Component ───────────────────────────────────────────────────────────
export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const property = await getProperty(id);

    const location   = getPropertyLocation(property) || "Uganda";
    const imageUrl   = getPropertyImage(property) || "/og-image.jpg";
    const isForSale  = property.listingPurpose === "SALE";

    // ── JSON-LD: RealEstateListing schema ─────────────────────────────────
    // Enables Google rich results — price, location & availability in search
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.title,
      description: `Property ${isForSale ? "for sale" : "for rent"} in ${location} listed on ${SITE_NAME}.`,
      url: `${SITE_URL}/properties/${id}`,
      image: imageUrl,
      datePosted: property.createdAt ?? undefined,
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "UGX",
        availability: "https://schema.org/InStock",
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split("T")[0],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "UG",
      },
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PropertyDetailView property={property} />
      </>
    );
  } catch {
    notFound();
  }
}