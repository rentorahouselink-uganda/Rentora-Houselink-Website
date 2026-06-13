import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rentorahouselink.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faqs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?limit=1000`, {
      next: { revalidate: 86400 }, // regenerate sitemap once per day
    });

    if (!res.ok) return staticRoutes;

    const data = await res.json();
    const properties: { id: string }[] = data.data ?? [];

    const propertyUrls: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyUrls];
  } catch {
    // If API is down, still serve the static routes
    return staticRoutes;
  }
}