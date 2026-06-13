import { getAuthToken } from "@/lib/auth/auth-context";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.rentorahouselink.com/api/v1";

type FavoriteRecord = {
  id?: string;
  propertyId?: string;
  property_id?: string;
  property?: {
    id?: string;
    _id?: string;
  };
};

function extractFavoriteId(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;

  const fav = item as FavoriteRecord;

  const directId =
    fav.propertyId ??
    fav.property_id ??
    fav.id ??
    fav.property?.id ??
    fav.property?._id;

  return typeof directId === "string" && directId.trim() ? directId : null;
}

export async function toggleFavorite(
  propertyId: string,
): Promise<{ saved: boolean }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_BASE_URL}/favorites/${propertyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to toggle favorite");
  }

  return response.json();
}

export async function getFavorites(): Promise<string[]> {
  const token = getAuthToken();
  if (!token) return [];

  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return [];

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload)) return [];

  return payload
    .map(extractFavoriteId)
    .filter((id): id is string => Boolean(id));
}