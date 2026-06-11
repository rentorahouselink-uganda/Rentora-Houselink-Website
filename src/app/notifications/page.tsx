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
    
    // Route to property if applicable, matching Flutter logic
    if (n.data?.propertyId) {
      router.push(`/explore/${n.data.propertyId}`);
    }
  };

  const handleDelete = async (id: string) => {
    const isUnread = !notifications.find(n => n.id === id)?.isRead;
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (isUnread) decrementUnread();
    await notificationsApi.deleteNotification(id);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm font-semibold text-emerald-600">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Body */}
      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BellSlashIcon className="h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">All caught up!</h3>
          <p className="mt-2 text-sm text-slate-500">When you get messages, updates or alerts, they will appear right here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
            <div className="p-4 text-center">
              <button 
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchNotifications(nextPage, true);
                }}
                disabled={loading}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition"
              >
                {loading ? "Loading..." : "Load older notifications"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}