const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.rentorahouselink.com/api/v1";

export type CreateInquiryPayload = {
  name: string;
  email: string;
  message: string;
};

export const inquiriesApi = {
  create: async (payload: CreateInquiryPayload): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
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