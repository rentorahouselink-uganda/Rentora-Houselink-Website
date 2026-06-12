import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { COMPANY_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'FAQs — Rentora Houselink Uganda',
  description: 'Frequently asked questions about our platform.',
};

// Changed `a` to accept React nodes so we can render rich links
const faqs = [
  {
    q: "Is Rentora free to use?",
    a: "Yes. Browsing listings, saving favorites, and submitting booking requests is completely free."
  },
  {
    q: "Are all properties verified?",
    a: "We physically inspect as many properties as possible and award a 'Verified by Rentora' badge. We always encourage you to do your own due diligence before making any payments."
  },
  {
    q: "How do I contact a landlord?",
    a: "Click the 'Enquire' or 'Call Agent' buttons on any listing to contact the owner or agent directly via WhatsApp or phone call."
  },
  {
    q: "Do you handle payments?",
    a: "No. All payments regarding rent, security deposits, or viewing fees are made directly between you and the property owner/agent."
  },
  {
    q: "Can I list my property?",
    a: (
      <>
        Yes! To maintain the quality and trust of our platform, we require property owners to contact us directly to list a property.{" "}
        <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 underline decoration-emerald-600/30 underline-offset-4 transition-colors">
          Click here to contact our team
        </Link>
        , and we will guide you through the onboarding process.
      </>
    )
  }
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-12">
          <ChevronLeftIcon className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about {COMPANY_NAME}.
          </p>
        </div>

        {/* Sleek Accordion List */}
        <div className="border-t border-slate-200 dark:border-slate-800">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-slate-200 dark:border-slate-800">
              <summary className="flex cursor-pointer items-center justify-between py-6 text-lg font-bold text-slate-900 dark:text-white focus:outline-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="ml-4 shrink-0 text-2xl font-light text-slate-400 dark:text-slate-500 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-6 pr-12 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}