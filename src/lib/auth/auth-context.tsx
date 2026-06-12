"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AuthUser } from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import {
  clearGuestBookings,
  getGuestBookingSyncPayload,
  hasGuestBookings,
} from "@/lib/bookings-storage";
import { syncGuestBookings } from "@/lib/api/bookings";

const TOKEN_KEY = "rh_token";
const USER_KEY = "rh_user";

// ── Standalone Helper ─────────────────────────────────────────────────────────

// Exported so non-React files (like API utilities) can grab the token safely
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSyncingGuestBookings: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  updateProfile: (data: { name: string }) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingGuestBookings, setIsSyncingGuestBookings] = useState(false);
  const lastSyncedTokenRef = useRef<string | null>(null);

  // Rehydrate from localStorage once on mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u) as AuthUser);
      }
    } catch {
      /* corrupted storage — start fresh */
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync guest bookings once the user is authenticated.
  useEffect(() => {
    if (isLoading) return;

    if (!user || !token) {
      lastSyncedTokenRef.current = null;
      setIsSyncingGuestBookings(false);
      return;
    }

    if (lastSyncedTokenRef.current === token) return;

    const guestBookings = getGuestBookingSyncPayload();

    if (!hasGuestBookings() || guestBookings.length === 0) {
      lastSyncedTokenRef.current = token;
      setIsSyncingGuestBookings(false);
      return;
    }

    let cancelled = false;

    setIsSyncingGuestBookings(true);

    (async () => {
      try {
        await syncGuestBookings(token, guestBookings);
        clearGuestBookings();
      } catch (error) {
        console.error("Failed to sync guest bookings:", error);
      } finally {
        if (!cancelled) {
          lastSyncedTokenRef.current = token;
          setIsSyncingGuestBookings(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoading, token, user]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function persist(t: string, u: AuthUser) {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  function clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    lastSyncedTokenRef.current = null;
    setIsSyncingGuestBookings(false);
  }

  // ── Auth methods ─────────────────────────────────────────────────────────────

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    persist(res.accessToken, res.user);
  }

  async function register(name: string, email: string, password: string) {
    const res = await authApi.register(name, email, password);
    persist(res.accessToken, res.user);
  }

  function logout() {
    clear();
  }

  async function forgotPassword(email: string) {
    await authApi.forgotPassword(email);
  }

  async function resetPassword(email: string, otp: string, newPassword: string) {
    await authApi.resetPassword(email, otp, newPassword);
  }

  async function updateProfile(data: { name: string }) {
    if (!token) throw new Error("Not authenticated");
    const updated = await authApi.updateProfile(data, token);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  async function changePassword(current: string, next: string) {
    if (!token) throw new Error("Not authenticated");
    await authApi.changePassword(current, next, token);
  }

  async function deleteAccount() {
    if (!token) throw new Error("Not authenticated");
    await authApi.deleteAccount(token);
    clear();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: user !== null,
        isSyncingGuestBookings,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}