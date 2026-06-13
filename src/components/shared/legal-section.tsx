import type { ReactNode } from 'react';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export default function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{title}</h2>
      <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_h3]:font-bold [&_h3]:text-zinc-900 [&_h3]:dark:text-white [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:text-zinc-900 [&_strong]:dark:text-white">
        {children}
      </div>
    </section>
  );
}