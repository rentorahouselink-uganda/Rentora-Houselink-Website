"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  HomeModernIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { formatMoney, formatBillingCycle, getPropertyImage, getPropertyLocation } from "@/lib/utils";
import { createBooking } from "@/lib/api/bookings";
import { upsertBooking } from "@/lib/bookings-storage";
import { BookingSuccess } from "./BookingSuccess";
import { useAuth } from "@/lib/auth/auth-context";

type FormValues = {
  name: string; phone: string; email: string; moveInDate: string; notes: string;
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

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {number}
      </span>
      <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
    </div>
  );
}

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: ReactNode; }) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

function InputWithIcon({ icon, className = "", children }: { icon: ReactNode; className?: string; children: ReactNode; }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
        {icon}
      </span>
      <div className="[&>input]:pl-7 [&>input]:w-full">{children}</div>
    </div>
  );
}

function inputCn(hasError: boolean): string {
  return [
    "w-full bg-transparent border-0 border-b py-3 pl-0 pr-4 text-sm text-zinc-900 dark:text-white outline-none transition-colors rounded-none focus:ring-0",
    "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError
      ? "border-rose-400 dark:border-rose-500"
      : "border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500",
  ].join(" ");
}

export function BookingForm({ property }: { property: Property }) {
  const { user, isLoading: authLoading } = useAuth();

  const [values, setValues] = useState<FormValues>({ name: "", phone: "", email: "", moveInDate: "", notes: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  // Auto-fill name/email from the logged-in user once auth state resolves
  useEffect(() => {
    if (!authLoading && user) {
      setValues((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [authLoading, user]);

  // ── FIX: Prioritize video thumbnails over standard images ──
  const thumbnail = property.videos?.[0]?.thumbnailUrl
    || property.images.find((i) => i.isPrimary)?.url
    || property.images?.[0]?.url;

  const location = property.area?.name ? `${property.area.name}, ${property.district.name}` : property.district.name;

  const minDate = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 365 * 86_400_000).toISOString().split("T")[0];

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
      setErrors(validationErrors); return;
    }

    setLoading(true); setServerError(null);

    try {
      const digits = values.phone.replace(/\D/g, "");
      const phone = `+256${digits.slice(-9)}`;

      const response = await createBooking({
        renterName: values.name.trim(), renterPhone: phone, renterEmail: values.email.trim() || undefined,
        propertyId: property.id, moveInDate: values.moveInDate, notes: values.notes.trim() || undefined,
      });

      upsertBooking({
        id: response.id, cancellationToken: response.cancellationToken, propertyId: property.id,
        propertyTitle: property.title, price: property.price ?? 0, location: getPropertyLocation(property),
        billingCycle: property.billingCycle ?? null, universityName: property.university?.name ?? null,
        thumbnailUrl: getPropertyImage(property), roomNumber: null, bookedAt: new Date().toISOString(), isCancelled: false,
      });

      setSuccessToken(response.cancellationToken ?? "");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (successToken !== null) return <BookingSuccess property={property} cancellationToken={successToken} />;

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/properties/${property.id}`}
        className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-12"
      >
        <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to listing
      </Link>

      {/* Property summary */}
      <div className="mb-12 flex items-start gap-5 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {thumbnail ? (
            <img src={thumbnail} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HomeModernIcon className="h-8 w-8 text-zinc-300 dark:text-zinc-600" strokeWidth={1} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {property.title}
          </h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <MapPinIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{location}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">
              {formatMoney(property.price)}
            </span>
            {property.listingPurpose !== "SALE" && property.billingCycle && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatBillingCycle(property.billingCycle)}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12" noValidate>
        {serverError && (
          <div className="border-l-2 border-rose-500 dark:border-rose-400 pl-4 py-1">
            <p className="text-sm text-rose-600 dark:text-rose-400">{serverError}</p>
          </div>
        )}

        {/* Section 01 */}
        <section>
          <SectionHeader number="01" title="Your Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
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

            <Field label="Phone Number" required error={errors.phone}>
              <div
                className={[
                  "flex items-end border-b transition-colors",
                  errors.phone
                    ? "border-rose-400 dark:border-rose-500"
                    : "border-zinc-300 dark:border-zinc-800 focus-within:border-emerald-600 dark:focus-within:border-emerald-500",
                ].join(" ")}
              >
                <span className="shrink-0 pb-3 pr-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 select-none">
                  +256
                </span>
                <div className="relative flex-1">
                  <PhoneIcon className="absolute left-0 bottom-3 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="700 000 000"
                    maxLength={9}
                    autoComplete="tel-national"
                    disabled={loading}
                    className="w-full bg-transparent border-0 py-3 pl-7 pr-4 text-sm text-zinc-900 dark:text-white outline-none rounded-none focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </Field>

            <div className="md:col-span-2">
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
            </div>
          </div>
        </section>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        {/* Section 02 */}
        <section>
          <SectionHeader number="02" title="Booking Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
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

            <div className="md:col-span-2">
              <Field label="Notes / Questions" hint="Optional — any special requests for the agent">
                <div className="relative">
                  <DocumentTextIcon className="absolute left-0 top-3 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                  <textarea
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    placeholder="Any special requests or questions for the agent?"
                    rows={4}
                    maxLength={300}
                    disabled={loading}
                    className={`${inputCn(false)} resize-none pl-7`}
                  />
                </div>
                <p className="mt-1.5 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {values.notes.length}/300
                </p>
              </Field>
            </div>
          </div>
        </section>

        {/* Info notice */}
        <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 py-1">
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Your request will be reviewed by the property contact. You'll receive a cancellation token to manage this booking if plans change.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            <span className="font-bold text-rose-500">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full md:w-auto items-center justify-center gap-3 bg-emerald-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-emerald-700 focus:outline-none dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <><span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent" /> Submitting…</>
            ) : (
              <>Review & Submit <ArrowRightIcon className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}