import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | 687 Merch',
  description:
    'Answers to common questions about screen print transfers, our three production models, pricing, garments, artwork, and turnaround.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
