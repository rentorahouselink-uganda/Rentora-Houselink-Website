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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10 space-y-20">
        
        {/* Navigation & Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-10">
            <ChevronLeftIcon className="h-4 w-4" /> Back to Home
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How Rentora Works
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400">
              Three simple steps to unlock the door to your new home.
            </p>
          </div>
        </div>

        {/* Flat Grid Steps */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-110 group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50">
                  <step.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-950">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden bg-emerald-600 dark:bg-emerald-900 rounded-[2rem] p-10 sm:p-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-800 dark:to-emerald-950 opacity-90" />
          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Ready to find your home?</h3>
            <Link 
              href="/explore" 
              className="inline-flex items-center justify-center bg-white text-emerald-700 px-8 py-4 rounded-xl text-base font-bold shadow-sm hover:bg-slate-50 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Start Browsing Properties
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}