"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

function validatePassword(pw: string): string | null {
  if (!pw) return "Password is required.";
  if (pw.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/explore");
  }, [authLoading, isAuthenticated, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    if (password !== confirm) errs.confirm = "Passwords do not match.";
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
      setApiError(
        err instanceof Error ? err.message : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b py-4 pl-0 pr-4 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-none";
  const inputNormal = `${inputClass} border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500`;
  const inputError  = `${inputClass} border-red-400 dark:border-red-600 focus:border-red-500`;

  function field(key: string) {
    return errors[key] ? inputError : inputNormal;
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
            Create your <span className="font-semibold">account.</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Join thousands finding homes across Uganda.
          </p>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">

          <SocialAuthButtons mode="register" />

          {apiError && (
            <div className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">

            {/* Full name */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                disabled={loading}
                className={field("name")}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className={field("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${field("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-0 bottom-4 text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showCf ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${field("confirm")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCf((v) => !v)}
                  className="absolute right-0 bottom-4 text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
                  tabIndex={-1}
                  aria-label={showCf ? "Hide password" : "Show password"}
                >
                  {showCf ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirm && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.confirm}</p>
              )}
            </div>

            <p className="text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              By creating an account you agree to Rentora&apos;s{" "}
              <Link href="/terms" className="font-bold text-zinc-700 underline underline-offset-2 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition">
                Terms of Use
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-bold text-zinc-700 underline underline-offset-2 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition">
                Privacy Policy
              </Link>.
            </p>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 bg-emerald-600 text-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}