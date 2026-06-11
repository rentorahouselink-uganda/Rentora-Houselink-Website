"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  HomeModernIcon,
  InformationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { formatMoney, formatBillingCycle, getPropertyImage, getPropertyLocation } from "@/lib/utils";
import { createBooking } from "@/lib/api/bookings";
import { upsertBooking } from "@/lib/bookings-storage";
import { BookingSuccess } from "./BookingSuccess";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Validation
// ─────────────────────────────────────────────────────────────────────────────

type FormValues = {
  name: string;
  phone: string;
  email: string;
  moveInDate: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (values.phone.replace(/\D/g, "").length < 9) {
    errors.phone = "Enter at least 9 digits after +256.";
  }
  if (!values.moveInDate) errors.moveInDate = "Please select a move-in date.";
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Presentational Helpers
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white select-none">
        {number}
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function InputWithIcon({
  icon,
  className = "",
  children,
}: {
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </span>
      <div className="[&>input]:pl-10 [&>input]:w-full">{children}</div>
    </div>
  );
}

function inputCn(hasError: boolean): string {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition",
    "placeholder:text-slate-400",
    "focus:ring-2",
    "disabled:cursor-not-allowed disabled:bg-slate-50",
    hasError
      ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-300/40"
      : "border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20",
  ].join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function BookingForm({ property }: { property: Property }) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    moveInDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const thumbnail =
    property.images.find((i) => i.isPrimary)?.url ?? property.images[0]?.url;
  const location = property.area?.name
    ? `${property.area.name}, ${property.district.name}`
    : property.district.name;

  const minDate = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 365 * 86_400_000)
    .toISOString()
    .split("T")[0];

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const digits = values.phone.replace(/\D/g, "");
      const phone = `+256${digits.slice(-9)}`;

      const response = await createBooking({
        renterName: values.name.trim(),
        renterPhone: phone,
        renterEmail: values.email.trim() || undefined,
        propertyId: property.id,
        moveInDate: values.moveInDate,
        notes: values.notes.trim() || undefined,
      });

      upsertBooking({
        id: response.id,
        cancellationToken: response.cancellationToken,
        propertyId: property.id,
        propertyTitle: property.title,
        price: property.price ?? 0,
        location: getPropertyLocation(property),
        billingCycle: property.billingCycle ?? null,
        universityName: property.university?.name ?? null,
        thumbnailUrl: getPropertyImage(property),
        roomNumber: null,
        bookedAt: new Date().toISOString(),
        isCancelled: false,
      });

      setSuccessToken(response.cancellationToken ?? "");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Success State
  if (successToken !== null) {
    return <BookingSuccess property={property} cancellationToken={successToken} />;
  }

  // Form View
  return (
    <div>
      {/* Property summary */}
      <div className="mb-8 flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {thumbnail ? (
            <img src={thumbnail} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HomeModernIcon className="h-8 w-8 text-slate-300" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{property.title}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-emerald-700">
              {formatMoney(property.price)}
            </span>
            {property.listingPurpose !== "SALE" && property.billingCycle && (
              <span className="text-xs text-slate-500">
                {formatBillingCycle(property.billingCycle)}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <p className="text-sm text-rose-700">{serverError}</p>
          </div>
        )}

        {/* Section 01: Your Details */}
        <section className="space-y-4">
          <SectionHeader number="01" title="Your Details" />
          {/* ... rest of the fields (same as before) ... */}
          <Field label="Full Name" required error={errors.name}>
            <InputWithIcon icon={<UserIcon className="h-4 w-4" />}>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                disabled={loading}
                className={inputCn(!!errors.name)}
              />
            </InputWithIcon>
          </Field>

          <Field label="Phone Number" required error={errors.phone} hint="We'll contact you on this number">
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 select-none">
                +256
              </span>
              <InputWithIcon icon={<PhoneIcon className="h-4 w-4" />} className="flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="700 000 000"
                  maxLength={9}
                  autoComplete="tel-national"
                  disabled={loading}
                  className={`${inputCn(!!errors.phone)} rounded-l-none`}
                />
              </InputWithIcon>
            </div>
          </Field>

          <Field label="Email Address" error={errors.email} hint="Optional — for a booking confirmation copy">
            <InputWithIcon icon={<EnvelopeIcon className="h-4 w-4" />}>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className={inputCn(false)}
              />
            </InputWithIcon>
          </Field>
        </section>

        <hr className="border-slate-200" />

        {/* Section 02: Booking Details */}
        <section className="space-y-4">
          <SectionHeader number="02" title="Booking Details" />

          <Field label="Move-in Date" required error={errors.moveInDate}>
            <InputWithIcon icon={<CalendarDaysIcon className="h-4 w-4" />}>
              <input
                type="date"
                name="moveInDate"
                value={values.moveInDate}
                onChange={handleChange}
                min={minDate}
                max={maxDate}
                disabled={loading}
                className={inputCn(!!errors.moveInDate)}
              />
            </InputWithIcon>
          </Field>

          <Field label="Notes / Questions" hint="Optional — any special requests for the agent">
            <div className="relative">
              <DocumentTextIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <textarea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                placeholder="Any special requests or questions for the agent?"
                rows={3}
                maxLength={300}
                disabled={loading}
                className={`${inputCn(false)} resize-none pl-10`}
              />
            </div>
            <p className="mt-1 text-right text-xs text-slate-400">
              {values.notes.length}/300
            </p>
          </Field>
        </section>

        {/* Info notice */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <p className="text-sm leading-relaxed text-blue-700">
            Your request will be reviewed by the property contact. You'll receive a cancellation token to manage this booking if plans change.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          <span className="font-bold text-rose-500">*</span> Required fields
        </p>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting…
            </>
          ) : (
            <>
              Review & Submit
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}