import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us | Rentora Houselink Uganda',
  description: 'Learn about Uganda\'s most trusted property rental platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-10 space-y-20">
        
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          RETURN HOME
        </Link>

        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-white">
            About <span className="font-semibold">Rentora.</span>
          </h1>
          <p className="mt-6 text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Uganda&apos;s trusted platform connecting renters with verified properties.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Our Mission</h3>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Founded in Uganda, Rentora Houselink was built to eliminate the stress and uncertainty in the local rental market. We provide verified listings, direct landlord contact, and a seamless digital experience.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Our Core Values</h3>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
              {['Transparency in pricing', 'Trust & Verification', 'Simplicity in design', 'Putting the User First'].map((value, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <h2 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white mb-12">
            Why <span className="font-semibold">Choose Us?</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              { title: "Verified Listings", desc: "Every property is physically inspected before being marked verified." },
              { title: "Direct Contact", desc: "Chat directly with landlords and agents via WhatsApp or phone." },
              { title: "Real Photos", desc: "No fake or misleading images. What you see is exactly what you get." },
            ].map((item, i) => (
              <div key={i} className="border-t-2 border-emerald-600 pt-5">
                <h4 className="font-bold text-lg text-zinc-900 dark:text-white mb-3">{item.title}</h4>
                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer block */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16 text-center">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">Proudly serving renters and property owners across Uganda.</p>
          <p className="mt-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">{COMPANY_NAME} • {COMPANY_ADDRESS}</p>
        </div>
      </main>
    </div>
  );
}