"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  HomeModernIcon,
  XMarkIcon,
  ChevronDownIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { useNotifications } from "@/lib/notifications/notification-context";

const navLinks = [
  { label: "Explore",     href: "/explore" },
  { label: "My Bookings", href: "/bookings" },
  { label: "How it works",href: "/how-it-works" },
  { label: "Contact",     href: "/contact" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount } = useNotifications(); // ── Added Notifications hook
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
              <HomeModernIcon className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-slate-950">
              Rentora<span className="text-emerald-600"> Houselink UG</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoading ? (
              <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-100" />
            ) : isAuthenticated && user ? (
              <>
                {/* ── Desktop Notification Bell ── */}
                <Link
                  href="/notifications"
                  className="relative flex items-center justify-center rounded-full p-1.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition"
                  aria-label="View notifications"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* ── User Dropdown ── */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white select-none">
                      {getInitials(user.name)}
                    </span>
                    <span className="hidden lg:block max-w-[96px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl shadow-slate-200/60">
                      <div className="border-b border-slate-100 px-4 pb-2.5 pt-1.5">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="truncate text-xs text-slate-400">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        My Bookings
                      </Link>
                      <div className="mt-1 border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
              >
                Sign in
              </Link>
            )}

            <Link
              href="#"
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              List Property
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-100 py-3 md:hidden">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 px-3 pt-4">
              {isAuthenticated ? (
                <>
                  {/* ── Mobile Notification Link ── */}
                  <Link 
                    href="/notifications" 
                    className="flex items-center text-sm font-semibold text-slate-700 hover:text-emerald-600" 
                    onClick={() => setMobileOpen(false)}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/account" className="text-sm font-semibold text-slate-700 hover:text-emerald-600" onClick={() => setMobileOpen(false)}>
                    My Account
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-600">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-emerald-600" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
              )}
              <div className="w-full pt-2">
                <Link
                  href="#"
                  className="flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  onClick={() => setMobileOpen(false)}
                >
                  List Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}