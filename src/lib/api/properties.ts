import { PaginatedResponse, PaginationMeta } from "@/types/pagination";
import { Property, PropertyQuery } from "@/types/property";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.rentorahouselink.com/api/v1";

type RawPropertyResponse = {
  data?: Property[];
  meta?: Partial<PaginationMeta>;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

function buildQueryString(query: PropertyQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

function normalizeMeta(response: RawPropertyResponse): PaginationMeta {
  const page = Number(response.meta?.page ?? response.page ?? 1);
  const limit = Number(response.meta?.limit ?? response.limit ?? 12);
  const total = Number(response.meta?.total ?? response.total ?? 0);
  const totalPages = Number(
    response.meta?.totalPages ??
      response.totalPages ??
      Math.ceil(total / limit),
  );
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: response.meta?.hasNextPage ?? page < totalPages,
    hasPreviousPage: response.meta?.hasPreviousPage ?? page > 1,
  };
}

export async function getProperties(query: PropertyQuery): Promise<PaginatedResponse<Property>> {
  const queryString = buildQueryString(query);
  const targetUrl = `${API_BASE_URL}/properties?${queryString}`;
  
  // Optional: Log the exact URL for debugging what parameters break the backend
  // console.log(`Fetching: ${targetUrl}`);

  const response = await fetch(targetUrl, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
  });
  
  if (!response.ok) {
    // Attempt to grab any JSON error message the backend sent back
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to load properties. (Status: ${response.status})`);
  }
  
  const body = (await response.json()) as RawPropertyResponse;
  return { data: body.data ?? [], meta: normalizeMeta(body) };
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
  });
  
  if (!response.ok) {
    if (response.status === 404) throw new Error("Property not found");
    throw new Error("Failed to load property details.");
  }
  
  return response.json();
}

export async function getSimilarProperties(property: Property, limit = 5): Promise<Property[]> {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };

  try {
    const primaryRes = await fetch(
      `${API_BASE_URL}/properties?${buildQueryString({
        districtId: property.district.id,
        type: property.type,
        status: "AVAILABLE",
        limit: 6,
        page: 1,
      })}`,
      { headers, cache: "no-store" },
    );

    if (!primaryRes.ok) return [];

    const primaryData = ((await primaryRes.json()) as RawPropertyResponse).data ?? [];
    const primaryList = primaryData.filter((p) => p.id !== property.id).slice(0, limit);

    if (primaryList.length >= 3) return primaryList;

    const seenIds = new Set([property.id, ...primaryList.map((p) => p.id)]);
    const needed = limit - primaryList.length;

    const fallbackRes = await fetch(
      `${API_BASE_URL}/properties?${buildQueryString({
        type: property.type,
        status: "AVAILABLE",
        limit: needed + seenIds.size,
        page: 1,
      })}`,
      { headers, cache: "no-store" },
    );

    if (!fallbackRes.ok) return primaryList;

    const fallbackData = ((await fallbackRes.json()) as RawPropertyResponse).data ?? [];
    const fallbackList = fallbackData.filter((p) => !seenIds.has(p.id)).slice(0, needed);

    return [...primaryList, ...fallbackList];
  } catch {
    return [];
  }
}