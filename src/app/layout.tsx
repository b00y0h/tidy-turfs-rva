import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'TidyTurfs RVA',
              description: 'Professional lawn care services in Richmond, Virginia',
              url: 'https://tidyturfsrva.com',
              areaServed: {
                '@type': 'City',
                name: 'Richmond',
                addressRegion: 'VA',
                addressCountry: 'US',
              },
              serviceType: ['Lawn Mowing', 'Landscaping', 'Leaf Removal', 'Mulching', 'Hedge Trimming'],
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
