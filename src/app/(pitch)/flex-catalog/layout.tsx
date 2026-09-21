import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Two Print Runs. Your Whole Catalog. | 687 Merch',
  description:
    'One light-ink run and one dark-ink run unlocks every garment style and colorway — tees, hoodies, tanks, totes, and more — without re-ordering the artwork.',
  openGraph: {
    title: 'Two Print Runs. Your Whole Catalog.',
    description:
      'Print once, apply to anything. Tees, hoodies, tanks, hats — one design, every colorway, no repeat print runs.',
    type: 'website',
  },
};

export default function FlexCatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
