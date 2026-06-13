"use client";

import { AppNotification } from "@/lib/api/notifications";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircleIcon, XCircleIcon, ShieldCheckIcon,
  HomeIcon, LockClosedIcon, MegaphoneIcon, BellIcon, TrashIcon
} from "@heroicons/react/24/outline";

type Props = {
  notification: AppNotification;
  onTap: () => void;
  onDismiss: () => void;
};

const getStyleForType = (type: string) => {
  switch (type) {
    case "BOOKING_CONFIRMED": return { Icon: CheckCircleIcon, color: "text-emerald-600 dark:text-emerald-400" };
    case "BOOKING_CANCELLED": return { Icon: XCircleIcon,     color: "text-red-500 dark:text-red-400" };
    case "COMPLAINT_UPDATED": return { Icon: ShieldCheckIcon, color: "text-blue-500 dark:text-blue-400" };
    case "NEW_PROPERTY":      return { Icon: HomeIcon,         color: "text-emerald-600 dark:text-emerald-400" };
    case "PASSWORD_CHANGED":  return { Icon: LockClosedIcon,   color: "text-zinc-500 dark:text-zinc-400" };
    case "SYSTEM_ALERT":      return { Icon: MegaphoneIcon,    color: "text-orange-500 dark:text-orange-400" };
    default:                  return { Icon: BellIcon,         color: "text-zinc-400 dark:text-zinc-500" };
  }
};

export function NotificationTile({ notification, onTap, onDismiss }: Props) {
  const { Icon, color } = getStyleForType(notification.type);
  const isUnread = !notification.isRead;

  return (
    <div
      className={`group relative flex cursor-pointer items-start gap-5 border-b border-zinc-200 py-5 pl-5 pr-12 transition-colors dark:border-zinc-800 ${
        isUnread
          ? "border-l-2 border-l-emerald-600 bg-emerald-50/40 dark:border-l-emerald-500 dark:bg-emerald-500/5"
          : "border-l-2 border-l-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
      }`}
      onClick={onTap}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-zinc-200 dark:border-zinc-800">
        <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <h4 className={`text-base ${isUnread ? "font-bold text-zinc-900 dark:text-white" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>
            {notification.title}
          </h4>
          <span className={`shrink-0 text-[11px] uppercase tracking-widest ${isUnread ? "font-bold text-emerald-600 dark:text-emerald-500" : "font-medium text-zinc-400 dark:text-zinc-500"}`}>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={`mt-1.5 text-sm leading-relaxed ${isUnread ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>
          {notification.message}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 dark:text-zinc-500 dark:hover:text-red-500 lg:opacity-0 max-lg:opacity-100"
        title="Delete notification"
      >
        <TrashIcon className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}