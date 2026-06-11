import { ExplorePage } from "@/components/properties/ExplorePage";
import { getProperties } from "@/lib/api/properties";
import { PropertyQuery } from "@/types/property";

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

  // Fetch main listing and featured properties in parallel.
  // Featured fetch is non-critical — a failure silently yields an empty banner.
  const [result, featuredResult] = await Promise.all([
    getProperties(buildPropertyQuery(params)),
    getProperties({
      status: "AVAILABLE",
      isFeatured: true,
      limit: 8,
      page: 1,
    }).catch(() => null),
  ]);

  return (
    <ExplorePage
      properties={result.data}
      meta={result.meta}
      searchParams={params}
      featuredProperties={featuredResult?.data ?? []}
    />
  );
}