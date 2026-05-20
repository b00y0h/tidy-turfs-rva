import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TidyTurf RVA | Professional Lawn Care in Richmond, VA",
  description:
    "TidyTurf RVA offers professional lawn care services in Richmond, Virginia. Mowing, edging, trimming, leaf removal, mulching & more. Get a free quote from Richmond's hardest-working teen entrepreneur!",
  keywords:
    "lawn care, Richmond VA, lawn mowing, landscaping, yard work, TidyTurf, leaf removal, mulching",
  authors: [{ name: "Clayton Smith" }],
  openGraph: {
    title: "TidyTurf RVA | Professional Lawn Care in Richmond, VA",
    description:
      "Professionals with a purpose. Your Lawn's New Best Friend. Professional lawn care from Richmond's hardest-working teen.",
    url: "https://tidyturfrva.com",
    siteName: "TidyTurf RVA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TidyTurf RVA | Professional Lawn Care",
    description: "Professionals with a purpose. Your Lawn's New Best Friend.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
