"use client";

import Link from "next/link";
import {
  CheckCircleIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";

type BookingSuccessProps = {
  property: Property;
  cancellationToken: string;
};

export function BookingSuccess({ property, cancellationToken }: BookingSuccessProps) {
  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Icon */}
      <CheckCircleIcon className="h-16 w-16 text-emerald-600 dark:text-emerald-500 mb-6" strokeWidth={1} />

      <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
        Request Submitted.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-md">
        Your booking request for{" "}
        <span className="font-semibold text-zinc-900 dark:text-white">{property.title}</span> has been
        sent. The property contact will reach out to you shortly.
      </p>

      {/* What happens next */}
      <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="mt-8 mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          What happens next
        </h2>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-b border-zinc-100 dark:border-zinc-800">
          {[
            {
              Icon: PhoneIcon,
              text: "The property contact will review your request and call you on the number you provided.",
            },
            {
              Icon: CalendarDaysIcon,
              text: "They will confirm availability and arrange a viewing or move-in date.",
            },
            {
              Icon: ReceiptRefundIcon,
              text: "Use your cancellation token below if you ever need to cancel this request.",
            },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4 py-5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation token */}
      {cancellationToken && (
        <div className="mt-6 border-l-2 border-amber-500 dark:border-amber-600 pl-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-2">
            Cancellation Token — save this
          </p>
          <p className="break-all font-mono text-sm font-semibold text-zinc-900 dark:text-white">
            {cancellationToken}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/explore"
          className="block w-full bg-emerald-600 px-6 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          Continue Exploring
        </Link>
        <Link
          href={`/properties/${property.id}`}
          className="block w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Back to listing
        </Link>
      </div>
    </div>
  );
}