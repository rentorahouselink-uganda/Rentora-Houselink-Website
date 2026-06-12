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
    case "BOOKING_CONFIRMED": return { Icon: CheckCircleIcon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" };
    case "BOOKING_CANCELLED": return { Icon: XCircleIcon, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
    case "COMPLAINT_UPDATED": return { Icon: ShieldCheckIcon, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" };
    case "NEW_PROPERTY":      return { Icon: HomeIcon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" };
    case "PASSWORD_CHANGED":  return { Icon: LockClosedIcon, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
    case "SYSTEM_ALERT":      return { Icon: MegaphoneIcon, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" };
    default:                  return { Icon: BellIcon, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
  }
};

export function NotificationTile({ notification, onTap, onDismiss }: Props) {
  const { Icon, color, bg } = getStyleForType(notification.type);
  const isUnread = !notification.isRead;

  return (
    <div 
      className={`group relative flex cursor-pointer items-start gap-5 border-b border-slate-200 dark:border-slate-800/60 py-5 transition-all ${
        isUnread 
          ? "bg-emerald-50/50 dark:bg-emerald-900/10 px-4 -mx-4 rounded-2xl border-transparent" 
          : "bg-transparent hover:bg-white dark:hover:bg-slate-900 px-4 -mx-4 rounded-2xl hover:border-transparent"
      }`}
      onClick={onTap}
    >
      {/* Icon */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 pr-10">
        <div className="flex items-center justify-between">
          <h4 className={`text-base ${isUnread ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300"}`}>
            {notification.title}
          </h4>
          <span className={`text-xs ${isUnread ? "font-bold text-emerald-600 dark:text-emerald-500" : "font-medium text-slate-400 dark:text-slate-500"}`}>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={`mt-1.5 text-sm leading-relaxed ${isUnread ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
          {notification.message}
        </p>
      </div>

      {/* Unread Dot */}
      {isUnread && (
        <div className="absolute left-4 top-5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-slate-50 dark:ring-slate-950" />
      )}

      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 dark:text-slate-500 opacity-0 transition hover:text-red-600 dark:hover:text-red-500 group-hover:opacity-100 lg:opacity-0 max-lg:opacity-100"
        title="Delete notification"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}