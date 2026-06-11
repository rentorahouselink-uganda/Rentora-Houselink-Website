import { ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

type Props = { isCancelled: boolean };

export function BookingStatusBadge({ isCancelled }: Props) {
  if (isCancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <XCircleIcon className="h-3.5 w-3.5" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <ClockIcon className="h-3.5 w-3.5" />
      Pending Review
    </span>
  );
}