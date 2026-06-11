import { AuthResponse, AuthUser } from "@/types/auth";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://rentora-api.duckdns.org/api/v1";

type FetchOpts = Omit<RequestInit, "headers"> & {
  token?: string;
  headers?: Record<string, string>;
};

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Something went wrong. Please try again.",
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    apiFetch<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    }),

  updateProfile: (data: { name: string }, token: string) =>
    apiFetch<AuthUser>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  changePassword: (currentPassword: string, newPassword: string, token: string) =>
    apiFetch<void>("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
      token,
    }),

  deleteAccount: (token: string) =>
    apiFetch<void>("/users/me", { method: "DELETE", token }),
};