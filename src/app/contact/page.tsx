'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  CheckCircleIcon,
  ArrowRightIcon 
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

  // Premium, flush input styling - updated to highlight the bottom border in brand blue on focus
  const inputClass =
    'w-full bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-800 py-4 pl-0 pr-4 text-base text-zinc-900 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-none';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-100">
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-16 lg:py-10">
        
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors mb-16 lg:mb-24"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          RETURN HOME
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Typography & Info */}
          <div className="lg:col-span-5">
            <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-white mb-8">
              Let's start a <br className="hidden lg:block" />
              <span className="font-semibold">conversation.</span>
            </h1>
            
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-12 leading-relaxed max-w-md">
              Whether you need to list new properties, request account changes, or have a general inquiry, our team is directly available to assist you.
            </p>

            <div className="space-y-12">
              <div className="group">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                  Direct Inquiries
                </h3>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-4 text-xl font-medium text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <EnvelopeIcon className="h-6 w-6 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                  Headquarters
                </h3>
                <div className="flex items-start gap-4 text-xl font-medium text-zinc-900 dark:text-white">
                  <MapPinIcon className="h-6 w-6 text-zinc-400 shrink-0 mt-1" />
                  <p className="max-w-[200px] leading-snug">{COMPANY_ADDRESS}</p>
                </div>
              </div>

              {/* Elevated, borderless reporting link */}
              <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/50 max-w-md">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                  Encountered a platform issue or a dispute with an agent?
                </p>
                <Link 
                  href="/report" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Access our Resolution Center <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Flush Form / Success State */}
          <div className="lg:col-span-7 lg:pl-12 xl:pl-24">
            {sent ? (
              <div className="flex flex-col justify-center h-full min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CheckCircleIcon className="h-16 w-16 text-emerald-600 dark:text-emerald-500 mb-8" strokeWidth={1} />
                <h3 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white mb-4">
                  Received.
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md mb-12">
                  Thank you, {name}. We have logged your message and will coordinate a response to <span className="text-zinc-900 dark:text-white font-medium">{email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                    if (!user) {
                      setName('');
                      setEmail('');
                    }
                  }}
                  className="self-start text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500 border-b border-emerald-600 dark:border-emerald-500 pb-1 hover:opacity-60 transition-opacity"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-in fade-in duration-700">
                
                {error && (
                  <div className="text-sm font-medium text-red-600 dark:text-red-400 pb-4">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="relative group pt-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide the details of your inquiry..."
                    rows={6}
                    disabled={loading}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 bg-emerald-600 text-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    )}
                    {loading ? 'Processing...' : 'Submit Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}