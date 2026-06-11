import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us — Rentora Houselink Uganda',
  description: 'Learn about Uganda\'s most trusted property rental platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            About Rentora Houselink
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Uganda&apos;s trusted platform connecting renters with verified properties.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Founded in Uganda, Rentora Houselink was built with one mission: to make finding 
            and renting quality homes simple, transparent, and trustworthy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To eliminate the stress and uncertainty in Uganda&apos;s rental market by providing 
              verified listings, direct landlord contact, and a seamless digital experience.
            </p>
          </div>

          <div className="bg-card border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>✓ Transparency</li>
              <li>✓ Trust &amp; Verification</li>
              <li>✓ Simplicity</li>
              <li>✓ Local Focus</li>
              <li>✓ User First</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Verified Listings", desc: "Every property is physically inspected before being marked verified." },
              { title: "Direct Contact", desc: "Chat directly with landlords and agents via WhatsApp or phone." },
              { title: "Real Photos", desc: "No fake or misleading images. What you see is what you get." },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-2xl p-8 text-center">
          <p className="text-lg font-medium">Proudly serving renters and property owners across Uganda.</p>
          <p className="mt-2 text-sm text-muted-foreground">{COMPANY_NAME} • {COMPANY_ADDRESS}</p>
        </div>
      </main>
    </div>
  );
}