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
import { useHeaderCompact } from "./header-compact-context";

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
    return <div className="h-9 w-9" aria-hidden />;
  }

  const themes = ["system", "light", "dark"] as const;
  type Theme = (typeof themes)[number];
  const current = (theme as Theme) ?? "system";
  const currentIndex = themes.indexOf(current);

  function cycle() {
    setTheme(themes[(currentIndex + 1) % themes.length]);
  }

  const icons: Record<Theme, React.ReactNode> = {
    system: <ComputerDesktopIcon className="h-5 w-5" strokeWidth={1.5} />,
    light:  <SunIcon className="h-5 w-5" strokeWidth={1.5} />,
    dark:   <MoonIcon className="h-5 w-5" strokeWidth={1.5} />,
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="grid h-9 w-9 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-emerald-600 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400 transition-all"
      aria-label="Toggle theme"
    >
      {icons[current]}
    </button>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isHeaderCompact } = useHeaderCompact();

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
        icon={<ArrowRightStartOnRectangleIcon className="h-6 w-6" strokeWidth={1.5} />}
      />

      <header
        className={[
          "sticky top-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-300 dark:bg-zinc-950/80",
          isHeaderCompact
            ? "border-b-0"
            : "border-b border-zinc-200 dark:border-zinc-800/50",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="flex h-20 items-center justify-between gap-8">

            {/* ── Logo ── */}
            <Link href="/" className="flex shrink-0 items-center gap-3 group">
              <Image
                src="/logo_no_bg.png"
                alt="Rentora Houselink logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain dark:invert dark:brightness-0 transition-transform group-hover:scale-105"
                priority
              />
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Rentora
                <span className="font-medium text-emerald-600 dark:text-emerald-500 ml-1.5">Houselink UG</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "px-4 py-2 text-base tracking-wide transition-all duration-300 rounded-md",
                      isActive
                        ? "font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "font-medium text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-emerald-400 dark:hover:bg-zinc-800/50",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Desktop right side ── */}
            <div className="hidden items-center gap-6 md:flex">
              <ThemeToggle />

              {isLoading ? (
                <div className="h-6 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              ) : isAuthenticated && user ? (
                <div className="flex items-center gap-6">
                  <Link
                    href="/notifications"
                    className="relative text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    aria-label="View notifications"
                  >
                    <BellIcon className="h-5 w-5" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-3 rounded-md p-1 pr-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-all"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-[11px] font-bold tracking-widest text-white select-none shadow-sm shadow-emerald-600/20">
                        {getInitials(user.name)}
                      </span>
                      <span className="hidden max-w-[120px] truncate lg:block font-semibold">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-md border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-4 mb-2">
                          <p className="truncate text-base font-bold text-zinc-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-sm text-zinc-500 mt-0.5">{user.email}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Link
                            href="/account"
                            onClick={() => setDropdownOpen(false)}
                            className="rounded-md px-4 py-2 text-base font-medium text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-zinc-400 dark:hover:text-emerald-400 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            Account Settings
                          </Link>
                          <Link
                            href="/bookings"
                            onClick={() => setDropdownOpen(false)}
                            className="rounded-md px-4 py-2 text-base font-medium text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-zinc-400 dark:hover:text-emerald-400 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            Manage Bookings
                          </Link>
                          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                            <button
                              onClick={handleLogoutClick}
                              className="flex w-full rounded-md text-left px-4 py-2 text-base font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-emerald-600 px-6 py-2.5 text-base font-bold tracking-wider text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  SIGN IN
                </Link>
              )}
            </div>

            {/* ── Mobile: theme toggle + hamburger ── */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <XMarkIcon className="h-6 w-6" strokeWidth={1.5} /> : <Bars3Icon className="h-6 w-6" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* ── Mobile menu ── */}
          {mobileOpen && (
            <div className="border-t border-zinc-200 py-6 dark:border-zinc-800/50 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={[
                        "text-3xl px-4 py-3 rounded-md transition-colors",
                        isActive
                          ? "font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "font-light text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800/50"
                      ].join(" ")}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 px-4 pt-8 dark:border-zinc-800/50">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/notifications"
                      className="flex items-center text-base font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/account"
                      className="text-base font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="text-left text-base font-bold uppercase tracking-widest text-red-600 dark:text-red-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-base font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 transition-colors"
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