import { getAuthToken } from "@/lib/auth/auth-context";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://rentora-api.duckdns.org/api/v1";

export async function toggleFavorite(propertyId: string): Promise<{ saved: boolean }> {
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

export async function getFavorites(): Promise<any[]> {
  const token = getAuthToken();
  if (!token) return [];

  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return [];
  return response.json();
}