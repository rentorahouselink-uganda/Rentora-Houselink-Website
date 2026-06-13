import { PaginatedResponse } from "@/types/pagination";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.rentorahouselink.com/api/v1";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
};

// Helper to get auth token from localStorage (matching your AuthContext logic)
const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const notificationsApi = {
  getNotifications: async (page = 1, limit = 20): Promise<PaginatedResponse<AppNotification>> => {
    const res = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load notifications");
    return res.json();
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, { headers: getHeaders() });
    if (!res.ok) return 0;
    const data = await res.json();
    return Number(data.count) || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PATCH", headers: getHeaders() });
  },

  markAllAsRead: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/notifications/read-all`, { method: "PATCH", headers: getHeaders() });
  },

  deleteNotification: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/notifications/${id}`, { method: "DELETE", headers: getHeaders() });
  },
};