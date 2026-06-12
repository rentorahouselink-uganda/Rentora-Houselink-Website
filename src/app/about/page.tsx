import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us — Rentora Houselink Uganda',
  description: 'Learn about Uganda\'s most trusted property rental platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10 space-y-16">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            About Rentora Houselink
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Uganda&apos;s trusted platform connecting renters with verified properties.
          </p>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded in Uganda, Rentora Houselink was built to eliminate the stress and uncertainty in the local rental market. We provide verified listings, direct landlord contact, and a seamless digital experience.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h3>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              {['Transparency in pricing', 'Trust & Verification', 'Simplicity in design', 'Putting the User First'].map((value, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Why Choose Us */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Why Choose Us?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: "Verified Listings", desc: "Every property is physically inspected before being marked verified." },
              { title: "Direct Contact", desc: "Chat directly with landlords and agents via WhatsApp or phone." },
              { title: "Real Photos", desc: "No fake or misleading images. What you see is exactly what you get." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{item.title}</h4>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer block */}
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-10 text-center">
          <p className="text-lg font-bold text-slate-900 dark:text-white">Proudly serving renters and property owners across Uganda.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">{COMPANY_NAME} • {COMPANY_ADDRESS}</p>
        </div>
      </main>
    </div>
  );
}