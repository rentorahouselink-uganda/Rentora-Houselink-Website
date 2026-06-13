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

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string | null; children: React.ReactNode; }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
        {label}
        {required && <span className="ml-0.5 text-emerald-600">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function inputCls(hasError?: boolean) {
  return [
    "w-full bg-transparent border-0 border-b py-4 pl-0 pr-4 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
    "outline-none transition-colors focus:ring-0 rounded-none",
    hasError ? "border-red-400 dark:border-red-600 focus:border-red-500" : "border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500",
  ].join(" ");
}

function SectionHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string; }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="text-4xl font-light text-zinc-200 dark:text-zinc-800 shrink-0">
        {step}
      </span>
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

type FormErrors = Partial<Record<"name" | "phone" | "description", string>>;
function validate(name: string, phone: string, description: string): FormErrors {
  const errors: FormErrors = {};
  if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (phone.replace(/\D/g, "").length < 9) errors.phone = "Enter 9 digits after +256.";
  if (description.trim().length < 10) errors.description = "Please provide at least 10 characters.";
  return errors;
}

export function ReportPage({ propertyId, propertyTitle }: Props) {
  const uid = useId();

  const [category, setCategory] = useState(propertyId ? "PROPERTY_CONDITION" : "APP_ISSUE");
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

    setSubmitting(true); setApiError(null);
    try {
      await createComplaint({
        submitterName: name.trim(), submitterPhone: `+256${phone.replace(/\D/g, "")}`, submitterEmail: email.trim() || undefined,
        category, description: description.trim(), propertyId: propertyId || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-20 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
        <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-600 dark:text-emerald-500" strokeWidth={1} />
          <h1 className="mt-8 text-4xl font-light tracking-tight text-zinc-900 dark:text-white">Report Submitted.</h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Thank you for bringing this to our attention. Our team reviews all reports within 24–48 hours and takes every concern seriously.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/explore" className="rounded-md bg-emerald-600 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700">
              Back to Explore
            </Link>
            {propertyId && (
              <Link href={`/properties/${propertyId}`} className="rounded-md border border-zinc-300 dark:border-zinc-700 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition-colors hover:border-emerald-600 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400">
                Back to detail
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <Link 
          href={propertyId ? `/properties/${propertyId}` : "/explore"} 
          className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-12"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {propertyId ? "BACK TO DETAIL" : "BACK"}
        </Link>

        <div className="mb-16">
          {propertyTitle ? (
            <div className="flex items-start gap-5">
              <FlagIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-500 shrink-0 mt-2" strokeWidth={1} />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Reporting Property</p>
                <h1 className="mt-2 truncate text-4xl sm:text-5xl font-light tracking-tight capitalize text-zinc-900 dark:text-white">
                  {propertyTitle.toLowerCase()}
                </h1>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-white">
                Report an <span className="font-semibold">Issue.</span>
              </h1>
              <p className="mt-6 text-lg text-zinc-500 dark:text-zinc-400">
                Help us improve Rentora Houselink by flagging any issues you&apos;ve encountered.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-16">
            <section>
              <SectionHeader step="01" title="Issue Category" subtitle="Select the category that best describes your issue." />
              <CategoryGrid selected={category} onSelect={setCategory} disabled={submitting} />
            </section>

            <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
              <SectionHeader step="02" title="Your Details" subtitle="We may reach out with updates on your report." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field id={`${uid}-name`} label="Full Name" required error={errors.name}>
                  <input id={`${uid}-name`} type="text" placeholder="Your full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} className={inputCls(!!errors.name)} />
                </Field>
                <Field id={`${uid}-phone`} label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                      +256
                    </span>
                    <input id={`${uid}-phone`} type="tel" placeholder="700 000 000" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} disabled={submitting} className={[inputCls(!!errors.phone), "pl-14"].join(" ")} />
                  </div>
                </Field>
                <div className="md:col-span-2">
                  <Field id={`${uid}-email`} label="Email Address" error={null}>
                    <input id={`${uid}-email`} type="email" placeholder="you@example.com (optional)" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} className={inputCls()} />
                  </Field>
                </div>
              </div>
            </section>

            <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
              <SectionHeader step="03" title="Description" subtitle="Provide as much detail as possible so we can help effectively." />
              <Field id={`${uid}-desc`} label="Describe the issue" required error={errors.description}>
                <textarea id={`${uid}-desc`} rows={5} placeholder="What happened? What did you expect? Include any relevant details…" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 600))} disabled={submitting} className={[inputCls(!!errors.description), "resize-none"].join(" ")} />
                <p className="mt-1 text-right text-xs text-zinc-400 dark:text-zinc-500">
                  {description.length} / 600
                </p>
              </Field>
            </section>

            <div className="flex items-start gap-3 border-l-2 border-emerald-600 pl-4 py-1">
              <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Our team reviews all reports within 24–48 hours. We appreciate your help in keeping the platform safe and reliable.
              </p>
            </div>

            {apiError && (
              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                {apiError}
              </div>
            )}

            <div className="flex justify-end pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <button type="submit" disabled={submitting} className="w-full md:w-auto rounded-md bg-emerald-600 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:opacity-60">
                {submitting ? "Submitting…" : "Submit Report"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}