import { ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

type Props = { isCancelled: boolean };

export function BookingStatusBadge({ isCancelled }: Props) {
  if (isCancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-rose-300 dark:border-rose-900 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
        <XCircleIcon className="h-3 w-3" strokeWidth={1.5} />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 border border-amber-300 dark:border-amber-800 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
      <ClockIcon className="h-3 w-3" strokeWidth={1.5} />
      Pending
    </span>
  );
}