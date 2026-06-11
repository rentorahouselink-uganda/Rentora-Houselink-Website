const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://rentora-api.duckdns.org/api/v1";

export type CreateComplaintRequest = {
  submitterName: string;
  submitterPhone: string;
  submitterEmail?: string;
  category: string;
  description: string;
  propertyId?: string;
};

export async function createComplaint(
  data: CreateComplaintRequest,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Failed to submit your report. Please try again.",
    );
  }
}