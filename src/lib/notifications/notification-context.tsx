"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { notificationsApi } from "@/lib/api/notifications";
import { useAuth } from "@/lib/auth/auth-context";

type NotificationContextValue = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  markAllReadLocally: () => void;
  decrementUnread: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Silently fail for badges
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshUnreadCount();
    // Optional: Set up a polling interval here if you don't have WebSockets
    // const interval = setInterval(refreshUnreadCount, 60000); 
    // return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  const markAllReadLocally = () => setUnreadCount(0);
  const decrementUnread = () => setUnreadCount((prev) => Math.max(0, prev - 1));

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, markAllReadLocally, decrementUnread }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};