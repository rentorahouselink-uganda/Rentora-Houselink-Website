"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/lib/auth/auth-context";

function validatePassword(pw: string): string | null {
  if (!pw) return "Password is required.";
  if (pw.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/explore");
  }, [authLoading, isAuthenticated, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim())          errs.name     = "Full name is required.";
    if (!email.trim())         errs.email    = "Email is required.";
    const pwErr = validatePassword(password);
    if (pwErr)                 errs.password = pwErr;
    if (password !== confirm)  errs.confirm  = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.push("/explore");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Join thousands finding homes across Uganda.
        </p>
      </div>

      {apiError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          label="Full name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="John Doe"
          autoComplete="name"
          disabled={loading}
          error={errors.name}
        />

        <AuthInput
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
          error={errors.email}
        />

        <AuthInput
          label="Password"
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
          label="Confirm password"
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

        {/* Terms */}
        <p className="text-center text-xs leading-relaxed text-slate-400">
          By creating an account you agree to Rentora&apos;s{" "}
          <Link href="/terms" className="font-medium text-slate-600 underline underline-offset-2 hover:text-emerald-600 transition">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-slate-600 underline underline-offset-2 hover:text-emerald-600 transition">
            Privacy Policy
          </Link>.
        </p>

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
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}