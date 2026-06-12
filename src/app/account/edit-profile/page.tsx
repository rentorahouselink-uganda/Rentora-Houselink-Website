"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth();

  const [name,    setName]    = useState(user?.name ?? "");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false);

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters."); return;
    }

    setLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      setSuccess(true);
      setTimeout(() => router.push("/account"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 py-10 lg:py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">

        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to account
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Profile</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Update your display name.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-extrabold text-white shadow-inner">
              {getInitials(name || user.name)}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{name || user.name}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Your initials update as you type</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                disabled={loading}
                autoFocus
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-500 dark:text-slate-500"
              />
              <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                Email changes are not available at this time.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || name.trim() === user.name}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {loading && (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}