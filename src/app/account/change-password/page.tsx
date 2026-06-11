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
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/lib/auth/auth-context";

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  const levels = [
    { label: "Weak",   color: "bg-red-500"    },
    { label: "Weak",   color: "bg-red-500"    },
    { label: "Fair",   color: "bg-amber-400"  },
    { label: "Good",   color: "bg-yellow-400" },
    { label: "Strong", color: "bg-emerald-500" },
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
    // Only LOCAL accounts can change password
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
    setApiError("");
    setSuccess(false);
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
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 py-10">
      <div className="mx-auto max-w-lg px-4 sm:px-6">

        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to account
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Change Password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a strong password to keep your account secure.</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {apiError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircleIcon className="h-4 w-4 shrink-0" />
              Password changed successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AuthInput
              label="Current password"
              type={showCur ? "text" : "password"}
              value={current}
              onChange={setCurrent}
              placeholder="Your current password"
              autoComplete="current-password"
              disabled={loading}
              error={errors.current}
              autoFocus
              suffix={
                <button type="button" onClick={() => setShowCur((v) => !v)} className="text-slate-400 hover:text-slate-600 transition" tabIndex={-1}>
                  {showCur ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              }
            />

            <div>
              <AuthInput
                label="New password"
                type={showNext ? "text" : "password"}
                value={next}
                onChange={setNext}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={loading}
                error={errors.next}
                suffix={
                  <button type="button" onClick={() => setShowNext((v) => !v)} className="text-slate-400 hover:text-slate-600 transition" tabIndex={-1}>
                    {showNext ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                }
              />
              {/* Strength bar */}
              {next.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strength.score ? strength.color : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score >= 4 ? "text-emerald-600"
                    : strength.score >= 3 ? "text-yellow-600"
                    : "text-red-500"
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            <AuthInput
              label="Confirm new password"
              type={showConf ? "text" : "password"}
              value={confirm}
              onChange={setConfirm}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              disabled={loading}
              error={errors.confirm}
              suffix={
                <button type="button" onClick={() => setShowConf((v) => !v)} className="text-slate-400 hover:text-slate-600 transition" tabIndex={-1}>
                  {showConf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              }
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
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}