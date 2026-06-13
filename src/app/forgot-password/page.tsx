"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
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
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border-0 border-b border-zinc-300 dark:border-zinc-800 bg-transparent px-0 py-3 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed selection:bg-emerald-100 selection:text-emerald-900 rounded-none [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#fff]";

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md space-y-12">

        <Link
          href="/login"
          className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" strokeWidth={1.5} />
          Back to sign in
        </Link>

        <div className="space-y-4">
          <EnvelopeIcon className="mb-4 h-8 w-8 text-zinc-400 dark:text-zinc-600" strokeWidth={1} />
          <h1 className="text-3xl font-light tracking-wide text-zinc-900 dark:text-white">
            Forgot your password?
          </h1>
          <p className="text-base tracking-wide text-zinc-500 dark:text-zinc-400">
            Enter your email and we&apos;ll send you a recovery code.
          </p>
        </div>

        {sent ? (
          <div className="animate-in fade-in py-6 duration-500">
            <p className="text-lg font-light tracking-wide text-emerald-700 dark:text-emerald-400">
              Recovery email sent.
            </p>
            <p className="mt-2 text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
              Redirecting to enter your reset code&hellip;
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            {error && (
              <div className="text-sm font-medium tracking-wide text-red-600 dark:text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                autoFocus
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-sm bg-emerald-600 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
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
        )}
      </div>
    </main>
  );
}