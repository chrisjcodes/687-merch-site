import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Let Us Handle the Merch | 687 Merch',
  description:
    'Self-contained production van, 4–6hr battery, full staffing, and zero venue coordination. We show up, run the whole operation, and send you a check when it\'s over.',
  openGraph: {
    title: 'Let Us Handle the Merch',
    description:
      'Self-contained van. 4–6hr battery. Full staffing. Zero venue coordination. You point us at the crowd — we handle everything else.',
    type: 'website',
  },
};

export default function MobileLogisticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
