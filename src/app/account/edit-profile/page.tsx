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
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const inputClass = "w-full bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-800 py-4 pl-0 pr-4 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-none";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-950 py-6 lg:py-20 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="mx-auto max-w-lg px-4 sm:px-6">

        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to account
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
            Edit <span className="font-semibold">Profile.</span>
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">Update your display name.</p>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <div className="mb-10 flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-emerald-600 text-xl font-bold text-white">
              {getInitials(name || user.name)}
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">{name || user.name}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Your initials update as you type</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 flex items-center gap-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <div className="relative group">
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
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

            <div className="relative group">
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Email address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                Email changes are not available at this time.
              </p>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading || name.trim() === user.name}
                className="flex w-full items-center justify-center gap-3 rounded-sm bg-emerald-600 py-5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}