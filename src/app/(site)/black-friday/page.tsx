import { Metadata } from 'next';
import BlackFridayForm from './_components/BlackFridayForm';

export const metadata: Metadata = {
  title: 'Black Friday Special - $7 Shirts & Hats | 687 Merch',
  description: 'Limited time Black Friday offer: $7 shirts or $7 hats, single color single print for orders of 50 or more. Get your custom merch today!',
};

export default function BlackFridayPage() {
  return <BlackFridayForm />;
}
