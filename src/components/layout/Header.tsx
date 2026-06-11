"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bars3Icon,
  HomeModernIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "My Bookings", href: "/bookings" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
              <HomeModernIcon className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-slate-950">
              Rentora<span className="text-emerald-600"> Houselink UG</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href.startsWith("/") && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-md px-3.5 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="#"
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              List Property
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        {mobileOpen && (
          <div className="border-t border-slate-100 py-3 md:hidden">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-3 border-t border-slate-100 px-3 pt-3">
              <Link
                href="#"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="#"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={() => setMobileOpen(false)}
              >
                List Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}