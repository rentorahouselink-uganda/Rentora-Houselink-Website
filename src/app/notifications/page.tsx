"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNotification, notificationsApi } from "@/lib/api/notifications";
import { useNotifications } from "@/lib/notifications/notification-context";
import { NotificationTile } from "@/components/notifications/NotificationTile";
import { BellSlashIcon } from "@heroicons/react/24/outline";

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-5 border-b border-zinc-200 dark:border-zinc-800 py-5 pl-5 pr-12 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900" />
      <div className="flex-1 space-y-2.5 pt-0.5">
        <div className="flex items-center justify-between gap-8">
          <div className="h-4 w-44 rounded-sm bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-3 w-24 rounded-sm bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <div className="h-3 w-full rounded-sm bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-3 w-2/3 rounded-sm bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { unreadCount, markAllReadLocally, decrementUnread } = useNotifications();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = async (pageNum: number, append = false) => {
    try {
      const res = await notificationsApi.getNotifications(pageNum, 20);
      setNotifications(prev =>
        append ? [...prev, ...(res.data || [])] : (res.data || [])
      );
      setHasMore((res.meta?.page ?? 1) < (res.meta?.totalPages ?? 1));
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchNotifications(1);
      setLoading(false);
    })();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    markAllReadLocally();
  };

  const handleTap = async (n: AppNotification) => {
    if (!n.isRead) {
      await notificationsApi.markAsRead(n.id);
      setNotifications(prev =>
        prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
      );
      decrementUnread();
    }
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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    await fetchNotifications(nextPage, true);
    setLoadingMore(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-4 flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
              Notifications<span className="text-emerald-600 dark:text-emerald-500">.</span>
            </h1>
            {unreadCount > 0 && (
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="border-b border-zinc-900 pb-1 text-xs font-bold uppercase tracking-widest text-zinc-900 transition-opacity hover:opacity-60 dark:border-white dark:text-white"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex flex-col">
            {Array.from({ length: 7 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BellSlashIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700" strokeWidth={1} />
            <h3 className="mt-6 text-2xl font-light tracking-tight text-zinc-900 dark:text-white">All caught up.</h3>
            <p className="mt-2 max-w-sm text-base text-zinc-500 dark:text-zinc-400">
              When you get messages, updates or alerts, they will appear right here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map(n => (
              <NotificationTile
                key={n.id}
                notification={n}
                onTap={() => handleTap(n)}
                onDismiss={() => handleDelete(n.id)}
              />
            ))}

            {hasMore && (
              <div className="pt-4">
                {loadingMore ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="border-b border-emerald-600 pb-1 text-xs font-bold uppercase tracking-widest text-emerald-600 transition-opacity hover:opacity-60 dark:border-emerald-500 dark:text-emerald-500"
                    >
                      Load older notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}