"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  FlagIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CategoryGrid } from "./CategoryGrid";
import { createComplaint } from "@/lib/api/complaints";

type Props = {
  propertyId?: string;
  propertyTitle?: string;
};

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

function inputCls(hasError?: boolean) {
  return [
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400",
    "outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
    hasError ? "border-red-400" : "border-slate-200",
  ].join(" ");
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<"name" | "phone" | "description", string>>;

function validate(
  name: string,
  phone: string,
  description: string,
): FormErrors {
  const errors: FormErrors = {};
  if (name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (phone.replace(/\D/g, "").length < 9)
    errors.phone = "Enter 9 digits after +256.";
  if (description.trim().length < 10)
    errors.description = "Please provide at least 10 characters.";
  return errors;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ReportPage({ propertyId, propertyTitle }: Props) {
  const uid = useId();

  const [category, setCategory] = useState(
    propertyId ? "PROPERTY_CONDITION" : "APP_ISSUE",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(name, phone, description);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      await createComplaint({
        submitterName: name.trim(),
        submitterPhone: `+256${phone.replace(/\D/g, "")}`,
        submitterEmail: email.trim() || undefined,
        category,
        description: description.trim(),
        propertyId: propertyId || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-20">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
            Report Submitted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Thank you for bringing this to our attention. Our team reviews all
            reports within 24–48 hours and takes every concern seriously.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/explore"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Back to Explore
            </Link>
            {propertyId && (
              <Link
                href={`/properties/${propertyId}`}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Listing
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky nav */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={propertyId ? `/properties/${propertyId}` : "/explore"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            {propertyId ? "Back to listing" : "Back"}
          </Link>
          <span className="text-sm font-semibold text-slate-900">
            Report an Issue
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        {/* ── Page intro ── */}
        <div className="mb-8">
          {propertyTitle ? (
            // Reporting a specific property
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                <FlagIcon className="h-6 w-6 text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-rose-500">
                  Reporting Property
                </p>
                <p className="mt-0.5 truncate text-base font-extrabold capitalize text-slate-900">
                  {propertyTitle.toLowerCase()}
                </p>
              </div>
            </div>
          ) : (
            // General report
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Report an Issue
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Help us improve Rentora Houselink by flagging any issues
                you&apos;ve encountered.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-8">
            {/* ── 01 Category ── */}
            <section>
              <SectionHeader
                step="01"
                title="Issue Category"
                subtitle="Select the category that best describes your issue."
              />
              <CategoryGrid
                selected={category}
                onSelect={setCategory}
                disabled={submitting}
              />
            </section>

            <hr className="border-slate-200" />

            {/* ── 02 Your Details ── */}
            <section>
              <SectionHeader
                step="02"
                title="Your Details"
                subtitle="We may reach out with updates on your report."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id={`${uid}-name`}
                  label="Full Name"
                  required
                  error={errors.name}
                >
                  <input
                    id={`${uid}-name`}
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                <Field
                  id={`${uid}-phone`}
                  label="Phone Number"
                  required
                  error={errors.phone}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-slate-500">
                      +256
                    </span>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      placeholder="700 000 000"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))
                      }
                      disabled={submitting}
                      className={[inputCls(!!errors.phone), "pl-16"].join(" ")}
                    />
                  </div>
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    id={`${uid}-email`}
                    label="Email Address"
                    error={null}
                  >
                    <input
                      id={`${uid}-email`}
                      type="email"
                      placeholder="you@example.com (optional)"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      className={inputCls()}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* ── 03 Description ── */}
            <section>
              <SectionHeader
                step="03"
                title="Description"
                subtitle="Provide as much detail as possible so we can help effectively."
              />
              <Field
                id={`${uid}-desc`}
                label="Describe the issue"
                required
                error={errors.description}
              >
                <textarea
                  id={`${uid}-desc`}
                  rows={5}
                  placeholder="What happened? What did you expect? Include any relevant details…"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, 600))
                  }
                  disabled={submitting}
                  className={[inputCls(!!errors.description), "resize-none"].join(
                    " ",
                  )}
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {description.length} / 600
                </p>
              </Field>
            </section>

            {/* ── Info note ── */}
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
              <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <p className="text-sm leading-relaxed text-blue-800">
                Our team reviews all reports within 24–48 hours. We appreciate
                your help in keeping the platform safe and reliable.
              </p>
            </div>

            {/* ── API error ── */}
            {apiError && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {apiError}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}