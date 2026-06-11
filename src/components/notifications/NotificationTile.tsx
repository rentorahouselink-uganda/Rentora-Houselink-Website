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

// Map types to styling exactly like your Flutter switch statement
const getStyleForType = (type: string) => {
  switch (type) {
    case "BOOKING_CONFIRMED": return { Icon: CheckCircleIcon, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "BOOKING_CANCELLED": return { Icon: XCircleIcon, color: "text-red-600", bg: "bg-red-100" };
    case "COMPLAINT_UPDATED": return { Icon: ShieldCheckIcon, color: "text-blue-600", bg: "bg-blue-100" };
    case "NEW_PROPERTY":      return { Icon: HomeIcon, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "PASSWORD_CHANGED":  return { Icon: LockClosedIcon, color: "text-slate-600", bg: "bg-slate-100" };
    case "SYSTEM_ALERT":      return { Icon: MegaphoneIcon, color: "text-orange-600", bg: "bg-orange-100" };
    default:                  return { Icon: BellIcon, color: "text-slate-500", bg: "bg-slate-100" };
  }
};

export function NotificationTile({ notification, onTap, onDismiss }: Props) {
  const { Icon, color, bg } = getStyleForType(notification.type);
  const isUnread = !notification.isRead;

  return (
    <div 
      className={`group relative flex cursor-pointer items-start gap-4 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 ${isUnread ? "bg-emerald-50/30" : "bg-white"}`}
      onClick={onTap}
    >
      {/* Icon */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 pr-8">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm ${isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
            {notification.title}
          </h4>
          <span className={`text-xs ${isUnread ? "font-semibold text-emerald-600" : "text-slate-400"}`}>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={`mt-1 text-sm leading-relaxed ${isUnread ? "text-slate-800" : "text-slate-500"}`}>
          {notification.message}
        </p>
      </div>

      {/* Unread Dot */}
      {isUnread && (
        <div className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
      )}

      {/* Delete Button (Visible on hover on desktop) */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 lg:opacity-0 max-lg:opacity-100"
        title="Delete notification"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}