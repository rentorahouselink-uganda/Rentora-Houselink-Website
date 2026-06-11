import Link from "next/link";
import { HomeModernIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

const features = [
  "500+ verified properties across Uganda",
  "Browse rentals and homes for sale",
  "Instant booking with easy cancellation",
];

const stats = [
  { label: "Properties", value: "500+" },
  { label: "Districts",  value: "50+" },
  { label: "Renters",    value: "2k+" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* ── Left brand panel (desktop only) ────────────────────────────── */}
      <div className="relative hidden lg:flex w-[42%] xl:w-[40%] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 px-10 py-12">
        {/* Subtle grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Brand mark */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <HomeModernIcon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-white">
            Rentora Houselink
          </span>
        </Link>

        {/* Headline + features */}
        <div className="relative">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
            Uganda&apos;s #1 property platform
          </p>
          <h2 className="mb-7 text-3xl font-extrabold leading-snug text-white xl:text-[2.15rem]">
            Find your perfect home<br />in Uganda
          </h2>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span className="text-sm leading-relaxed text-white/80">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-extrabold text-white">{value}</p>
              <p className="mt-0.5 text-[11px] text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto bg-white px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile-only mini brand */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
              <HomeModernIcon className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              Rentora Houselink
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}