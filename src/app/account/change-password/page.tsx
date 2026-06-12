"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  const levels = [
    { label: "Weak",   color: "bg-red-500 dark:bg-red-600" },
    { label: "Weak",   color: "bg-red-500 dark:bg-red-600" },
    { label: "Fair",   color: "bg-amber-400 dark:bg-amber-500" },
    { label: "Good",   color: "bg-yellow-400 dark:bg-yellow-500" },
    { label: "Strong", color: "bg-emerald-500 dark:bg-emerald-600" },
  ];
  return { score, ...levels[score] };
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, changePassword } = useAuth();

  const [current,    setCurrent]    = useState("");
  const [next,       setNext]       = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNext,   setShowNext]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [apiError,   setApiError]   = useState("");
  const [success,    setSuccess]    = useState(false);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
    if (!authLoading && user && user.provider !== "LOCAL") router.push("/account");
  }, [authLoading, isAuthenticated, user, router]);

  const strength = passwordStrength(next);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!current)          errs.current = "Current password is required.";
    if (next.length < 8)   errs.next    = "New password must be at least 8 characters.";
    if (next === current)  errs.next    = "New password must differ from your current password.";
    if (next !== confirm)  errs.confirm = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(""); setSuccess(false);
    if (!validate()) return;

    setLoading(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => router.push("/account"), 1400);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not change password. Please try again.");
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
  const inputClassError = "w-full rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed";

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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Change Password</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Choose a strong password to keep your account secure.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          {apiError && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
              {apiError}
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              Password changed successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCur ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Your current password"
                  autoComplete="current-password"
                  disabled={loading}
                  autoFocus
                  className={`${errors.current ? inputClassError : inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowCur((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition" tabIndex={-1}>
                  {showCur ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.current && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.current}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNext ? "text" : "password"}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${errors.next ? inputClassError : inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowNext((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition" tabIndex={-1}>
                  {showNext ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.next && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.next}</p>}
              
              {/* Strength bar */}
              {next.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength.score ? strength.color : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-bold tracking-wide uppercase ${
                    strength.score >= 4 ? "text-emerald-600 dark:text-emerald-500"
                    : strength.score >= 3 ? "text-yellow-600 dark:text-yellow-500"
                    : "text-red-500 dark:text-red-400"
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConf ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${errors.confirm ? inputClassError : inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowConf((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition" tabIndex={-1}>
                  {showConf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}