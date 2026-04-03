import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FrontendLayout({
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
