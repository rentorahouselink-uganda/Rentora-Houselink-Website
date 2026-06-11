"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
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

  // Guard: if we somehow land here without an email, go back
  if (!email) {
    return (
      <AuthLayout>
        <div className="text-center">
          <p className="mb-4 text-sm text-slate-500">
            No email found. Please start the password reset again.
          </p>
          <Link
            href="/forgot-password"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Go back
          </Link>
        </div>
      </AuthLayout>
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

  return (
    <AuthLayout>
      <Link
        href="/forgot-password"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Create new password
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-slate-700">{email}</span>.
        </p>
      </div>

      {apiError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          label="Reset code"
          type="text"
          inputMode="numeric"
          value={otp}
          onChange={setOtp}
          placeholder="6-digit code"
          maxLength={6}
          autoComplete="one-time-code"
          disabled={loading}
          error={errors.otp}
          autoFocus
        />

        <AuthInput
          label="New password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={loading}
          error={errors.password}
          suffix={
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600 transition" tabIndex={-1}>
              {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          }
        />

        <AuthInput
          label="Confirm new password"
          type={showCf ? "text" : "password"}
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={loading}
          error={errors.confirm}
          suffix={
            <button type="button" onClick={() => setShowCf((v) => !v)} className="text-slate-400 hover:text-slate-600 transition" tabIndex={-1}>
              {showCf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}