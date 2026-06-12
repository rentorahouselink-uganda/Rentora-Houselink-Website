import { ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

type Props = { isCancelled: boolean };

export function BookingStatusBadge({ isCancelled }: Props) {
  if (isCancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
        <XCircleIcon className="h-3.5 w-3.5" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
      <ClockIcon className="h-3.5 w-3.5" />
      Pending Review
    </span>
  );
}