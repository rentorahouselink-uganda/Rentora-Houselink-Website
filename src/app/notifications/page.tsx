"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNotification, notificationsApi } from "@/lib/api/notifications";
import { useNotifications } from "@/lib/notifications/notification-context";
import { NotificationTile } from "@/components/notifications/NotificationTile";
import { BellSlashIcon } from "@heroicons/react/24/outline";

export default function NotificationsPage() {
  const router = useRouter();
  const { unreadCount, markAllReadLocally, decrementUnread } = useNotifications();
  
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const res = await notificationsApi.getNotifications(pageNum, 20);
      setNotifications(prev => append ? [...prev, ...(res.data || [])] : (res.data || []));
      setHasMore(res.meta?.hasNextPage ?? false);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    markAllReadLocally();
  };

  const handleTap = async (n: AppNotification) => {
    if (!n.isRead) {
      await notificationsApi.markAsRead(n.id);
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
      decrementUnread();
    }
    
    // ── FIX: Corrected route from /explore/ to /properties/ ──
    if (n.data?.propertyId) {
      router.push(`/properties/${n.data.propertyId}`);
    }
  };

  const handleDelete = async (id: string) => {
    const isUnread = !notifications.find(n => n.id === id)?.isRead;
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (isUnread) decrementUnread();
    await notificationsApi.deleteNotification(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Body */}
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 mb-6">
              <BellSlashIcon className="h-10 w-10 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">All caught up!</h3>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-sm">When you get messages, updates or alerts, they will appear right here.</p>
          </div>
        ) : (
          /* ── FIX: Removed the card wrapper to make it a flat, integrated list ── */
          <div className="flex flex-col">
            {notifications.map(n => (
              <NotificationTile 
                key={n.id} 
                notification={n} 
                onTap={() => handleTap(n)} 
                onDismiss={() => handleDelete(n.id)} 
              />
            ))}
            
            {/* Pagination / Load More */}
            {hasMore && (
              <div className="pt-8 pb-4 text-center">
                <button 
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchNotifications(nextPage, true);
                  }}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {loading ? "Loading..." : "Load older notifications"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}