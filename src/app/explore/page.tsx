import { ExplorePage } from "@/components/properties/ExplorePage";
import { getProperties } from "@/lib/api/properties";
// 1. Import Property and PaginationMeta types
import { Property, PropertyQuery } from "@/types/property";
import { PaginationMeta } from "@/types/pagination"; 

type ExplorePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getString(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function getNumber(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = getString(params, key);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildPropertyQuery(
  params: Record<string, string | string[] | undefined>,
): PropertyQuery {
  return {
    page: getNumber(params, "page") ?? 1,
    limit: getNumber(params, "limit") ?? 12,
    status: getString(params, "status") ?? "AVAILABLE",
    type: getString(params, "type"),
    listingPurpose: getString(params, "listingPurpose"),
    districtId: getString(params, "districtId"),
    universityId: getString(params, "universityId"),
    minPrice: getNumber(params, "minPrice"),
    maxPrice: getNumber(params, "maxPrice"),
    numberOfRooms: getNumber(params, "numberOfRooms"),
    search: getString(params, "search"),
    sortBy: getString(params, "sortBy"),
    sortOrder: getString(params, "sortOrder"),
  };
}

export default async function ExploreRoute({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  // 2. Add explicit types to your initial states
  let propertiesData: { data: Property[]; meta: PaginationMeta } = { 
    data: [], 
    meta: { page: 1, limit: 12, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } 
  };
  
  // Explicitly set the type to Property[] instead of relying on inference
  let featuredData: Property[] = []; 
  let errorMessage: string | undefined = undefined;

  try {
    const [result, featuredResult] = await Promise.all([
      getProperties(buildPropertyQuery(params)),
      getProperties({
        status: "AVAILABLE",
        isFeatured: true,
        limit: 8,
        page: 1,
      }).catch(() => null),
    ]);
    
    propertiesData = result; // No longer needs 'as any'
    featuredData = featuredResult?.data ?? [];
  } catch (error: any) {
    // Check if it's a network/DNS resolution error
    if (error?.message?.includes("fetch failed") || error?.cause?.code === "ENOTFOUND") {
      errorMessage = "Unable to connect to the server. Please check your internet connection or try again in a moment.";
    } else {
      errorMessage = "We encountered an issue while loading the properties. Please try again later.";
    }
  }

  return (
    <ExplorePage
      properties={propertiesData.data}
      meta={propertiesData.meta} // No longer needs 'as any'
      searchParams={params}
      featuredProperties={featuredData}
      error={errorMessage} 
    />
  );
}