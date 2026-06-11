import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search, MessageCircle, Key } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — Rentora Houselink Uganda',
  description: 'Simple steps to find your next home or list your property.',
};

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    desc: "Filter by location, price, property type, and more. Use our smart search to find exactly what you need."
  },
  {
    icon: MessageCircle,
    title: "Connect Directly",
    desc: "Contact landlords and agents instantly via WhatsApp or phone. No middlemen, no hidden fees."
  },
  {
    icon: Key,
    title: "Book & Move In",
    desc: "Submit a booking request. Once accepted, coordinate directly with the owner to finalize and move in."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">How Rentora Works</h1>
          <p className="mt-4 text-xl text-muted-foreground">Three simple steps to your new home</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-card border rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                <step.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to find your home?</h3>
          <Link href="/explore" className="inline-block mt-4 bg-white text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition">
            Start Browsing Properties
          </Link>
        </div>
      </main>
    </div>
  );
}