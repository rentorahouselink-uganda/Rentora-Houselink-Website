"use client";

import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ── Data ─────────────────────────────────────────────────────────────
const exploreLinks = [
  { label: "All properties", href: "/explore" },
  { label: "Rentals", href: "/explore?type=RESIDENTIAL_HOUSE&listingPurpose=RENT" },
  { label: "Houses for sale", href: "/explore?type=RESIDENTIAL_HOUSE&listingPurpose=SALE" },
  { label: "Apartments", href: "/explore?type=APARTMENT" },
  { label: "Hostels", href: "/explore?type=HOSTEL" },
  { label: "Hotels", href: "/explore?type=HOTEL" },
];

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Contact us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/18dvDnbdYw/", Icon: FacebookIcon, color: "#1877F2" },
  { label: "X", href: "https://x.com/rentoraUganda", Icon: XIcon, color: "#000000", darkColor: "#FFFFFF" },
  { label: "Instagram", href: "https://www.instagram.com/rentorahouselink?utm_source=qr&igsh=dGE5MGJiZGIzemZr", Icon: InstagramIcon, color: "#E1306C" },
  { label: "TikTok", href: "https://www.tiktok.com/@rentorahouselink?_r=1&_t=ZS-97BKTzA0eoO", Icon: TikTokIcon, color: "#FF0050" },
  { label: "LinkedIn", href: "http://www.linkedin.com/in/rentorahouselinkuganda-rentorahouselink-uganda-97534440b", Icon: LinkedInIcon, color: "#0A66C2" },
];

// ── Main Component ───────────────────────────────────────────────────
export function Footer() {
  const year = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  
  // Use a mounted state to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        {/* Main grid */}
        <div className="grid gap-16 py-20 lg:py-24 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo_no_bg.png"
                alt="Rentora Houselink logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain dark:invert dark:brightness-0 transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Rentora
                <span className="font-medium text-emerald-600 dark:text-emerald-500 ml-1.5">Houselink UG</span>
              </span>
            </Link>

            <p className="mt-6 text-base leading-relaxed max-w-sm">
              Uganda&apos;s trusted platform for finding verified rental
              properties and homes for sale. Transparent pricing, real photos,
              direct landlord contact.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-base">
                <MapPinIcon className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
                Kampala, Uganda
              </div>
              <div className="flex items-center gap-3 text-base">
                <EnvelopeIcon className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
                <a
                  href="mailto:rentorahouselink@gmail.com"
                  className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  rentorahouselink@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links - Always colored */}
            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-300 mb-4">
                Follow us
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ label, href, Icon, color, darkColor }) => {
                  // Only evaluate the theme color if the component has mounted on the client
                  const isDarkMode = mounted && resolvedTheme === "dark";
                  const iconColor = (label === "X" && darkColor && isDarkMode) ? darkColor : color;

                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Rentora Houselink on ${label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
                    >
                      <Icon
                        className="h-4 w-4 transition-transform hover:scale-110"
                        style={{ color: iconColor }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-300 mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-300 mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile App */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-300 mb-6">
              Mobile App
            </h3>
            <p className="text-base leading-relaxed mb-6">
              Browse and save properties on the go with the native application.
            </p>
            <div className="space-y-3">
              <a
                href="#"
                className="group flex items-center gap-4 rounded-md border border-zinc-200 bg-transparent px-5 py-3.5 transition-all hover:border-emerald-600 hover:bg-emerald-50 dark:border-zinc-800 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
              >
                <AppleIcon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-emerald-600 dark:group-hover:text-white" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Download on the</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="group flex items-center gap-4 rounded-md border border-zinc-200 bg-transparent px-5 py-3.5 transition-all hover:border-emerald-600 hover:bg-emerald-50 dark:border-zinc-800 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
              >
                <PlayStoreIcon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Get it on</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-zinc-200 py-8 text-sm font-medium tracking-wide dark:border-zinc-800/50 sm:flex-row">
          <p>&copy; {year} Rentora Houselink UG. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Custom Icons ─────────────────────────────────────────────────────
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.193 2.155A1.5 1.5 0 0 0 2.5 3.42v17.162a1.5 1.5 0 0 0 .693 1.265l.064.04 9.176-9.176v-.218L3.257 2.115l-.064.04zM13.435 11.4l2.585-2.585-11.45-6.52c-.412-.236-.884-.21-1.26.046l10.125 9.059zm0 1.201l-10.125 9.06c.376.255.848.281 1.26.045l11.45-6.52-2.585-2.585zm3.228-2.072l2.365-1.348a1.536 1.536 0 0 0 0-2.678l-2.365-1.348-3.003 3.003 3.003 3.003z" />
    </svg>
  );
}

function FacebookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
    </svg>
  );
}

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}