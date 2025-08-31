import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "687 Merch | Think Big. Start Small.",
    template: "%s | 687 Merch"
  },
  description: "We help brands, artists, and small businesses launch and refine merchandise programs with flexible, small-batch production and creative support.",
  keywords: ["merchandise", "merch", "custom apparel", "t-shirts", "branding", "small batch", "687 merch"],
  authors: [{ name: "687 Merch" }],
  creator: "687 Merch",
  publisher: "687 Merch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://687merch.com",
    title: "687 Merch | Think Big. Start Small.",
    description: "We help brands, artists, and small businesses launch and refine merchandise programs with flexible, small-batch production and creative support.",
    siteName: "687 Merch",
  },
  twitter: {
    card: "summary_large_image",
    title: "687 Merch | Think Big. Start Small.",
    description: "We help brands, artists, and small businesses launch and refine merchandise programs with flexible, small-batch production and creative support.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}