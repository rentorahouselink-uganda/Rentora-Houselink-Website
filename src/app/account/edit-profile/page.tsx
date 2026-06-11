"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { AuthInput } from "@/components/auth/AuthInput";
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

  // Keep name in sync if user loads asynchronously
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
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
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 py-10">
      <div className="mx-auto max-w-lg px-4 sm:px-6">

        {/* Back nav */}
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to account
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Update your display name.</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Live avatar preview */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-extrabold text-white">
              {getInitials(name || user.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{name || user.name}</p>
              <p className="text-xs text-slate-400">Your initials update as you type</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircleIcon className="h-4 w-4 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AuthInput
              label="Full name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Your full name"
              autoComplete="name"
              disabled={loading}
              autoFocus
            />

            {/* Email — display only */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Email changes are not available at this time.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || name.trim() === user.name}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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