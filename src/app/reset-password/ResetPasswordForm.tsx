"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";

export function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get("email") ?? "";
  const { resetPassword } = useAuth();

  const [otp,      setOtp]      = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);

  if (!email) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4">
        <div className="text-center w-full max-w-md">
          <p className="mb-6 text-base text-slate-500 dark:text-slate-400">
            No email found. Please start the password reset again.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
          >
            Go back
          </Link>
        </div>
      </main>
    );
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (otp.trim().length !== 6)    errs.otp      = "Enter the 6-digit code from your email.";
    if (password.length < 8)        errs.password = "Password must be at least 8 characters.";
    if (password !== confirm)       errs.confirm  = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(email, otp.trim(), password);
      router.push("/login?reset=success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed";
  const inputClassError = "w-full rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create new password
          </h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Enter the 6-digit code sent to{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>.
          </p>
        </div>

        {apiError && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Reset code</label>
            <input type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} autoComplete="one-time-code" disabled={loading} autoFocus className={errors.otp ? inputClassError : inputClass} />
            {errors.otp && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.otp}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">New password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" disabled={loading} className={`${errors.password ? inputClassError : inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition" tabIndex={-1}>
                {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Confirm new password</label>
            <div className="relative">
              <input type={showCf ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" disabled={loading} className={`${errors.confirm ? inputClassError : inputClass} pr-12`} />
              <button type="button" onClick={() => setShowCf((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition" tabIndex={-1}>
                {showCf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirm && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading && (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}