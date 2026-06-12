"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { useNotifications } from "@/lib/notifications/notification-context";
import { useTheme } from "next-themes";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

const navLinks = [
  { label: "Explore",      href: "/explore" },
  { label: "My Bookings",  href: "/bookings" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Contact",      href: "/contact" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg" aria-hidden />;
  }

  const themes = ["system", "light", "dark"] as const;
  type Theme = (typeof themes)[number];
  const current = (theme as Theme) ?? "system";
  const currentIndex = themes.indexOf(current);

  function cycle() {
    setTheme(themes[(currentIndex + 1) % themes.length]);
  }

  const icons: Record<Theme, React.ReactNode> = {
    system: <ComputerDesktopIcon className="h-5 w-5" />,
    light:  <SunIcon className="h-5 w-5" />,
    dark:   <MoonIcon className="h-5 w-5" />,
  };

  const labels: Record<Theme, string> = {
    system: "System",
    light:  "Light",
    dark:   "Dark",
  };

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Theme: ${labels[current]} — click to cycle`}
      aria-label={`Current theme: ${labels[current]}. Click to cycle.`}
      className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {icons[current]}
    </button>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function confirmLogout() {
    logout();
    setShowLogoutModal(false);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  }

  function handleLogoutClick() {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  }

  return (
    <>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Sign out?"
        description="Are you sure you want to sign out? You will need to sign back in to manage your bookings and account."
        confirmText="Sign Out"
        isDanger={true}
        icon={<ArrowRightStartOnRectangleIcon className="h-6 w-6" strokeWidth={2} />}
      />
      
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex shrink-0 items-center gap-3 rounded-md">
              <Image
                src="/logo_no_bg.png"
                alt="Rentora Houselink logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain dark:invert dark:brightness-0"
                priority
              />
              <span className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                Rentora<span className="text-emerald-600"> Houselink UG</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
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
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Desktop right side ── */}
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />

              {isLoading ? (
                <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" />
              ) : isAuthenticated && user ? (
                <>
                  <Link
                    href="/notifications"
                    className="relative flex items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="View notifications"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white select-none">
                        {getInitials(user.name)}
                      </span>
                      <span className="hidden max-w-[96px] truncate lg:block">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDownIcon
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 px-4 pb-2.5 pt-1.5 dark:border-slate-700">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          My Bookings
                        </Link>
                        <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-700">
                          <button
                            onClick={handleLogoutClick}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/20"
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
                  className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* ── Mobile: theme toggle + hamburger ── */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* ── Mobile menu ── */}
          {mobileOpen && (
            <div className="border-t border-slate-100 py-3 dark:border-slate-700 md:hidden">
              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 px-3 pt-4 dark:border-slate-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/notifications"
                      className="flex items-center text-sm font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/account"
                      className="text-sm font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="text-sm font-semibold text-rose-600 dark:text-rose-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}