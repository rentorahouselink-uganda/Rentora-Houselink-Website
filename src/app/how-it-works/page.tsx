import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleOvalLeftEllipsisIcon, 
  KeyIcon 
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'How It Works — Rentora Houselink Uganda',
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-20">
        
        {/* Navigation & Header */}
        <div>
          <Link href="/" className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-12">
            <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> RETURN HOME
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

        {/* Flat Grid Steps */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="flex items-baseline justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <step.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-500 transition-transform group-hover:scale-110" strokeWidth={1} />
                <span className="text-4xl font-light text-zinc-200 dark:text-zinc-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{step.title}</h3>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-zinc-900 dark:bg-emerald-900/20 dark:border dark:border-emerald-900/40 px-10 py-16 sm:px-16 text-center">
          <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-8">
            Ready to find your <span className="font-semibold">home?</span>
          </h3>
          <Link 
            href="/explore" 
            className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors focus:outline-none"
          >
            Start Browsing Properties
          </Link>
        </div>
      </main>
    </div>
  );
}