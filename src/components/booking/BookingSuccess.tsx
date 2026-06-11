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
    <div className="py-8 text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
      </div>

      <h1 className="text-2xl font-extrabold text-slate-900">Request Submitted!</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Your booking request for{" "}
        <strong className="text-slate-900">{property.title}</strong> has been
        sent. The property contact will reach out to you shortly.
      </p>

      {/* What happens next */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left">
        <h2 className="mb-5 font-bold text-slate-900">What happens next?</h2>
        <div className="space-y-4">
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
            <div key={i} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-4 w-4 text-slate-600" />
              </div>
              <p className="pt-1.5 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation token */}
      {cancellationToken && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
            Cancellation Token — save this
          </p>
          <p className="break-all font-mono text-sm font-semibold text-amber-900">
            {cancellationToken}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/explore"
          className="block w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Continue Exploring
        </Link>
        <Link
          href={`/properties/${property.id}`}
          className="block w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back to listing
        </Link>
      </div>
    </div>
  );
}