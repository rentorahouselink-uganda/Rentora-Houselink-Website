import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY_NAME, COMPANY_ADDRESS, CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us — Rentora Houselink Uganda',
  description: 'Get in touch with our support team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">We&apos;re here to help.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5" /> Email
              </h3>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg hover:underline text-primary">
                {CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5" /> Office
              </h3>
              <p className="text-muted-foreground">{COMPANY_ADDRESS}</p>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-8">
            <h3 className="font-semibold mb-4">Send us a message</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border" />
              <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border" />
              <textarea placeholder="How can we help you?" rows={5} className="w-full px-4 py-3 rounded-xl border resize-y" />
              <button type="button" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}