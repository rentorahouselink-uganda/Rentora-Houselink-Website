import Link from "next/link";
import { EnvelopeIcon, HomeModernIcon, MapPinIcon } from "@heroicons/react/24/outline";

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
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ── */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
                <HomeModernIcon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Rentora<span className="text-emerald-400"> Houselink UG</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Uganda&apos;s trusted platform for finding verified rental
              properties and homes for sale. Transparent pricing, real photos,
              direct landlord contact.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPinIcon className="h-4 w-4 shrink-0 text-slate-500" />
                Kampala, Uganda
              </div>
              <div className="flex items-center gap-2 text-sm">
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href="mailto:rentorahouselink@gmail.com"
                  className="text-slate-400 transition hover:text-emerald-400"
                >
                  rentorahouselink@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App download */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Mobile App
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Browse and save properties on the go with the Rentora Houselink
              mobile app.
            </p>
            <div className="mt-5 space-y-2.5">
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 transition hover:border-emerald-600 hover:bg-slate-700"
              >
                <span className="text-xl leading-none">📱</span>
                <div>
                  <p className="text-[10px] font-medium text-slate-500">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 transition hover:border-emerald-600 hover:bg-slate-700"
              >
                <span className="text-xl leading-none">🤖</span>
                <div>
                  <p className="text-[10px] font-medium text-slate-500">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 py-6 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {year} Rentora Houselink UG. All rights reserved.</p>
          <div className="flex gap-5">
            <Link 
              href="/privacy" 
              className="transition hover:text-emerald-400"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="transition hover:text-emerald-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}