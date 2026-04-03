import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TidyTurfs RVA | Professional Lawn Care in Richmond, VA',
  description: 'TidyTurfs RVA offers professional lawn care services in Richmond, Virginia. Mowing, edging, trimming, leaf removal, mulching & more. Get a free quote from Richmond\'s hardest-working teen entrepreneur!',
  keywords: 'lawn care, Richmond VA, lawn mowing, landscaping, yard work, TidyTurfs, leaf removal, mulching',
  authors: [{ name: 'Clayton Smith' }],
  openGraph: {
    title: 'TidyTurfs RVA | Professional Lawn Care in Richmond, VA',
    description: 'Young. Hungry. Your Lawn\'s New Best Friend. Professional lawn care from Richmond\'s hardest-working teen.',
    url: 'https://tidyturfsrva.com',
    siteName: 'TidyTurfs RVA',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TidyTurfs RVA | Professional Lawn Care',
    description: 'Young. Hungry. Your Lawn\'s New Best Friend.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
