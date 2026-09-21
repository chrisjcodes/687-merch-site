import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Let Us Handle the Merch | 687 Merch' },
  description:
    "Self-contained production van, 4–6hr battery, full staffing, and zero venue coordination. We show up, run the whole operation, and send you a check when it's over.",
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Let Us Handle the Merch',
    description:
      'Self-contained van. 4–6hr battery. Full staffing. Zero venue coordination. You point us at the crowd — we handle everything else.',
    url: 'https://687merch.com/mobile-logistics',
    type: 'website',
  },
};

export default function MobileLogisticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
