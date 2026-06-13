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
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 font-sans">
        <div className="text-center w-full max-w-md">
          <p className="mb-8 text-base text-zinc-500 dark:text-zinc-400">
            No email found. Please start the password reset again.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-emerald-700 transition-colors"
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

  const inputClass = "w-full bg-transparent border-0 border-b py-4 pl-0 pr-10 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-none";
  const inputNormal = `${inputClass} border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500`;
  const inputErrorCls = `${inputClass} border-red-400 dark:border-red-600 focus:border-red-500`;

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="w-full max-w-md">

        <Link
          href="/forgot-password"
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-12"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
            Create new <span className="font-semibold">password.</span>
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
            Enter the 6-digit code sent to{" "}
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{email}</span>.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 text-sm font-medium text-red-600 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          <div className="relative group">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">Reset code</label>
            <input type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} autoComplete="one-time-code" disabled={loading} autoFocus className={errors.otp ? inputErrorCls : inputNormal} />
            {errors.otp && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.otp}</p>}
          </div>

          <div className="relative group">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">New password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" disabled={loading} className={errors.password ? inputErrorCls : inputNormal} />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-0 bottom-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" tabIndex={-1}>
                {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          <div className="relative group">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">Confirm new password</label>
            <div className="relative">
              <input type={showCf ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" disabled={loading} className={errors.confirm ? inputErrorCls : inputNormal} />
              <button type="button" onClick={() => setShowCf((v) => !v)} className="absolute right-0 bottom-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" tabIndex={-1}>
                {showCf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirm && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.confirm}</p>}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-3 bg-emerald-600 text-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}