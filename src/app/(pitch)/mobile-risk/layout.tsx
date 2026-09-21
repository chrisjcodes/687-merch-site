import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Is Pre-Order Merch Worth the Risk? | 687 Merch',
  description:
    'See how Mobile Merch eliminates financial and operational risk — no upfront inventory, deposit returns before we see a dollar, and nothing left to store when the event ends.',
  openGraph: {
    title: 'Is Pre-Order Merch Worth the Risk?',
    description:
      'No upfront inventory. Deposit returns first. Nothing left to store. See how Mobile Merch shifts the risk off your plate.',
    type: 'website',
  },
};

export default function MobileRiskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
