'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  CheckCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { COMPANY_ADDRESS, CONTACT_EMAIL } from '@/lib/constants';
import { inquiriesApi } from '@/lib/api/inquiries';
import { useAuth } from '@/lib/auth/auth-context';

export default function ContactPage() {
  const { user, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Auto-fill from the logged-in user once auth state has resolved
  useEffect(() => {
    if (!isLoading && user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [isLoading, user]);

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      await inquiriesApi.create({ name: name.trim(), email: email.trim(), message: message.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-12"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
              Contact Us
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Need to add your properties to Rentora, request account deletion, or have a general inquiry? We&apos;re here to help. Send us a message below.
            </p>

            {/* Complaint / Report Callout */}
            <div className="mb-12 flex items-start gap-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-5">
              <InformationCircleIcon className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1">
                  Have a complaint or issue?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300/90 leading-relaxed">
                  If you have an issue regarding a specific property, an agent&apos;s conduct, or a platform bug, please submit it through our dedicated{' '}
                  <Link href="/report" className="font-bold underline underline-offset-2 decoration-blue-400/50 hover:decoration-blue-400 transition-all">
                    Report an Issue
                  </Link>
                  {' '}page so our team can resolve it effectively.
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <EnvelopeIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                    Email Us
                  </h3>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-lg font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <MapPinIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                    Office Location
                  </h3>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {COMPANY_ADDRESS}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form / Success */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
            {sent ? (
              <div className="flex flex-col items-center text-center py-8 gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Message sent!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Thanks for reaching out,{' '}
                    <strong className="text-slate-700 dark:text-slate-300">{name}</strong>.
                    Our team will reply to{' '}
                    <strong className="text-slate-700 dark:text-slate-300">{email}</strong> as soon
                    as possible.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                    // Keep name/email if the user is logged in; clear only if guest
                    if (!user) {
                      setName('');
                      setEmail('');
                    }
                  }}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Send us a message
                </h3>

                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      disabled={loading}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 mt-2 bg-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:bg-emerald-700 transition focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && (
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    )}
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}