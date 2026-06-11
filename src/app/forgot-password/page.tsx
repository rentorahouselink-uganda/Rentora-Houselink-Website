"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/lib/auth/auth-context";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
      // Brief pause so the user sees the success state, then navigate
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Back link */}
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <EnvelopeIcon className="h-6 w-6 text-emerald-600" strokeWidth={1.75} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Forgot your password?
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your email and we&apos;ll send you a recovery code.
        </p>
      </div>

      {/* Success state */}
      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <p className="font-semibold">Recovery email sent!</p>
          <p className="mt-0.5 text-emerald-600">Redirecting you to enter your reset code…</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AuthInput
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              autoFocus
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Sending…" : "Send Reset Code"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}