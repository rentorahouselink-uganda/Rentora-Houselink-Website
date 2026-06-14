import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'How It Works | Rentora Houselink Uganda',
  description: 'Simple steps to find your next home or list your property.',
};

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: "Browse & Search",
    desc: "Filter by location, price, property type, and more. Use our smart search to find exactly what you need."
  },
  {
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: "Connect Directly",
    desc: "Contact landlords and agents instantly via WhatsApp or phone. No middlemen, no hidden fees."
  },
  {
    icon: KeyIcon,
    title: "Book & Move In",
    desc: "Submit a booking request. Once accepted, coordinate directly with the owner to finalize and move in."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10 space-y-20">

        <div>
          <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-7"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          RETURN HOME
        </Link>

          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-white">
              How Rentora <span className="font-semibold">Works.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Three simple steps to unlock the door to your new home.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="mb-8 flex items-baseline justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
                <step.icon className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-500" strokeWidth={1} />
                <span className="text-4xl font-light text-zinc-200 dark:text-zinc-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">{step.title}</h3>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="rounded-sm bg-zinc-900 px-10 py-16 text-center sm:px-16 dark:border dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <h3 className="mb-8 text-3xl font-light tracking-tight text-white sm:text-4xl">
            Ready to find your <span className="font-semibold">home?</span>
          </h3>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 focus:outline-none"
          >
            Start Browsing Properties
          </Link>
        </div>
      </main>
    </div>
  );
}