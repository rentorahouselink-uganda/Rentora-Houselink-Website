import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { COMPANY_ADDRESS, CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us — Rentora Houselink Uganda',
  description: 'Get in touch with our support team.',
};

export default function ContactPage() {
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-12">
          <ChevronLeftIcon className="h-4 w-4" /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Contact Us</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
              Have a question about a property, need help listing your home, or just want to share feedback? We&apos;re here to help.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <EnvelopeIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Email Us</h3>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <MapPinIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Office Location</h3>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {COMPANY_ADDRESS}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input type="text" placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input type="email" placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                <textarea placeholder="How can we help you?" rows={5} className={`${inputClass} resize-none`} />
              </div>
              <button type="button" className="w-full mt-2 bg-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:bg-emerald-700 transition focus:outline-none focus:ring-4 focus:ring-emerald-600/20">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}