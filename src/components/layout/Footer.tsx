import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        
        {/* ── Main grid ── */}
        <div className="grid gap-16 py-20 lg:py-24 sm:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo_no_bg.png"
                alt="Rentora Houselink logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain invert brightness-0 transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Rentora
                <span className="font-medium text-emerald-500 ml-1">Houselink UG</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed max-w-sm">
              Uganda&apos;s trusted platform for finding verified rental
              properties and homes for sale. Transparent pricing, real photos,
              direct landlord contact.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPinIcon className="h-5 w-5 shrink-0 text-zinc-600" strokeWidth={1.5} />
                Kampala, Uganda
              </div>
              <div className="flex items-center gap-3 text-sm">
                <EnvelopeIcon className="h-5 w-5 shrink-0 text-zinc-600" strokeWidth={1.5} />
                <a
                  href="mailto:rentorahouselink@gmail.com"
                  className="transition-colors hover:text-emerald-400"
                >
                  rentorahouselink@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App download */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Mobile App
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Browse and save properties on the go with the native application.
            </p>
            <div className="space-y-3">
              {/* Apple App Store Button */}
              <a
                href="#"
                className="group flex items-center gap-4 border border-zinc-800 bg-transparent px-5 py-3.5 transition-all hover:border-emerald-600 hover:bg-emerald-950/20"
              >
                <AppleIcon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-white" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>

              {/* Google Play Store Button */}
              <a
                href="#"
                className="group flex items-center gap-4 border border-zinc-800 bg-transparent px-5 py-3.5 transition-all hover:border-emerald-600 hover:bg-emerald-950/20"
              >
                <PlayStoreIcon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-emerald-400" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-zinc-800/50 py-8 text-xs font-medium tracking-wide text-zinc-500 sm:flex-row">
          <p>&copy; {year} Rentora Houselink UG. All rights reserved.</p>
          <div className="flex gap-8">
            <Link 
              href="/privacy" 
              className="transition-colors hover:text-emerald-400"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="transition-colors hover:text-emerald-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Custom SVG Icons ──

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
      <path d="M3.193 2.155A1.5 1.5 0 0 0 2.5 3.42v17.162a1.5 1.5 0 0 0 .693 1.265l.064.04 9.176-9.176v-.218L3.257 2.115l-.064.04zM13.435 11.4l2.585-2.585-11.45-6.52c-.412-.236-.884-.21-1.26.046l10.125 9.059zm0 1.201l-10.125 9.06c.376.255.848.281 1.26.045l11.45-6.52-2.585-2.585zm3.228-2.072l2.365-1.348a1.536 1.536 0 0 0 0-2.678l-2.365-1.348-3.003 3.003 3.003 3.003z"/>
    </svg>
  );
}