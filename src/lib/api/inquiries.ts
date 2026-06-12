const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://rentora-api.duckdns.org/api/v1';

export type CreateInquiryPayload = {
  name: string;
  email: string;
  message: string;
};

export const inquiriesApi = {
  create: async (payload: CreateInquiryPayload): Promise<void> => {
    const res = await fetch(`${API}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(
        typeof body.message === 'string'
          ? body.message
          : 'Failed to send message. Please try again.',
      );
    }
  },
};