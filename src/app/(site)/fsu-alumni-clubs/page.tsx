import { Metadata } from 'next';
import FsuClubsFaq from './_components/FsuClubsFaq';

export const metadata: Metadata = {
  title: 'FSU Alumni Club Merch FAQ',
  description:
    'What Florida State alumni clubs need to know about ordering club merch through 687 Merch: FSU branding and licensing guidelines, royalty fees, licensed printing, and how far ahead to start.',
  openGraph: {
    title: 'FSU Alumni Club Merch FAQ | 687 Merch',
    description:
      'Branding guidelines, licensing approval, royalties, and lead times for Florida State alumni clubs ordering merch.',
  },
};

export default function FsuAlumniClubsPage() {
  return <FsuClubsFaq />;
}
