import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Merch Table That Draws a Crowd | 687 Merch',
  description:
    'LED-lit production van, live printing, white-label branding, exclusive drops, and a revenue share that earns you money when demand is strong — not a flat fee win or lose.',
  openGraph: {
    title: 'The Merch Table That Draws a Crowd',
    description:
      'Live printing. LED van. Exclusive drops. Revenue share instead of a flat fee. We show up and run it — you earn on strong demand.',
    type: 'website',
  },
};

export default function MobileExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
