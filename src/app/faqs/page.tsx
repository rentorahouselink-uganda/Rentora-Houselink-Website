import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COMPANY_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'FAQs — Rentora Houselink Uganda',
  description: 'Frequently asked questions about our platform.',
};

const faqs = [
  {
    q: "Is Rentora free to use?",
    a: "Yes. Browsing listings, saving favorites, and submitting booking requests is completely free."
  },
  {
    q: "Are all properties verified?",
    a: "We physically inspect as many properties as possible and award a 'Verified by Rentora' badge. Always do your due diligence."
  },
  {
    q: "How do I contact a landlord?",
    a: "Click the WhatsApp or phone button on any listing to contact the owner/agent directly."
  },
  {
    q: "Do you handle payments?",
    a: "No. All payments are made directly between you and the property owner."
  },
  {
    q: "Can I list my property?",
    a: "Yes! Go to the 'List Property' section or contact us and our team will guide you."
  }
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-4xl font-extrabold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-10">Everything you need to know about {COMPANY_NAME}</p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-card border rounded-2xl p-6">
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                {faq.q}
                <span className="text-xl text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}