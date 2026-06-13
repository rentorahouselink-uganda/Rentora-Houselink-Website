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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        <Link href="/" className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-16">
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> RETURN HOME
        </Link>

        <div className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-white mb-6">
            Frequently <span className="font-semibold">Asked.</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Everything you need to know about {COMPANY_NAME}.
          </p>
        </div>

        {/* Sleek Accordion List */}
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-zinc-200 dark:border-zinc-800">
              <summary className="flex cursor-pointer items-center justify-between py-6 text-lg font-bold text-zinc-900 dark:text-white focus:outline-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="ml-4 shrink-0 text-2xl font-light text-zinc-400 dark:text-zinc-500 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-6 pr-12 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}