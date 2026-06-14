"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/explore");
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required."); return; }
    if (!password)      { setError("Password is required."); return; }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/explore");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-800 py-4 pl-0 pr-4 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-none [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#fff]";

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <div className="w-full max-w-md">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
            Welcome <span className="font-semibold">back.</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to continue your property search.
          </p>
        </div>

        {/* Removed border-t classes here to eliminate the top line */}
        <div className="pt-0">

          <SocialAuthButtons mode="login" />

          {error && (
            <div className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
            <div className="relative group">
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div className="relative group">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute bottom-4 right-0 text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-sm bg-emerald-600 py-5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}