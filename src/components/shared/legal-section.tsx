import type { ReactNode } from 'react';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export default function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1">
        {children}
      </div>
    </section>
  );
}