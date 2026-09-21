import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about screen print transfers, our three production models, pricing, garments, artwork, and turnaround.',
  alternates: {
    canonical: 'https://687merch.com/faq',
  },
  openGraph: {
    title: 'FAQ | 687 Merch',
    description:
      'Answers to common questions about screen print transfers, our three production models, pricing, garments, artwork, and turnaround.',
    url: 'https://687merch.com/faq',
    type: 'website',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
