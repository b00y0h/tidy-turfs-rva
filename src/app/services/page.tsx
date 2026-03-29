import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services & Pricing | TidyTurfs RVA',
  description: 'Professional lawn care services in Richmond, VA. Mowing, edging, trimming, leaf removal, mulching, and more. Fair pricing, quality work.',
}

const services = [
  {
    icon: '🌱',
    title: 'Lawn Mowing & Edging',
    description: 'A crisp, clean cut that makes your lawn the envy of the neighborhood. Every mow includes precision edging along driveways, walkways, and beds for those satisfying clean lines.',
    includes: ['Weekly or bi-weekly service', 'Precision edging', 'Blowing off walkways/driveways', 'Consistent cutting height'],
    priceRange: 'Starting at $35/visit',
    popular: true,
  },
  {
    icon: '✂️',
    title: 'Trimming & Hedge Work',
    description: 'Keep your shrubs, hedges, and ornamental plants looking sharp and healthy. Regular trimming promotes growth and keeps your landscape looking intentional.',
    includes: ['Shrub shaping', 'Hedge trimming', 'Ornamental grass cutting', 'Debris cleanup'],
    priceRange: 'Starting at $50',
  },
  {
    icon: '🍂',
    title: 'Leaf Removal',
    description: 'Don\'t let fall leaves suffocate your lawn. I\'ll clear, bag, and haul away all those leaves so your yard stays healthy through winter.',
    includes: ['Complete leaf removal', 'Bed cleaning', 'Bagging and hauling', 'Final blow-off'],
    priceRange: 'Starting at $75',
    seasonal: 'Fall',
  },
  {
    icon: '🪴',
    title: 'Mulching',
    description: 'Fresh mulch transforms your landscape beds, retains moisture, prevents weeds, and gives your yard that polished, cared-for look.',
    includes: ['Bed preparation', 'Quality mulch application', 'Clean edges', 'Even distribution'],
    priceRange: 'Starting at $100 (materials included)',
    seasonal: 'Spring/Fall',
  },
  {
    icon: '🧹',
    title: 'Spring/Fall Cleanup',
    description: 'Seasonal prep to keep your lawn thriving year-round. Get your yard ready for the growing season or prepped for winter dormancy.',
    includes: ['Debris removal', 'Bed cleanup', 'Trimming and pruning', 'Leaf/stick removal', 'General tidying'],
    priceRange: 'Starting at $125',
    seasonal: 'Seasonal',
  },
  {
    icon: '🌿',
    title: 'Basic Landscaping',
    description: 'Simple improvements that make a big impact. From planting to bed creation, I can help with small-scale landscape projects.',
    includes: ['Small plantings', 'Bed edging', 'Rock/stone work', 'Minor renovations'],
    priceRange: 'Custom quotes',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Services & Pricing
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Honest pricing, quality work. No surprises, no hidden fees—just a great-looking lawn.
          </p>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="bg-yellow-50 border-y border-yellow-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-yellow-800">
            <span className="font-semibold">💡 Note:</span> Prices vary based on lawn size and condition. 
            Get a free custom quote—just tell me about your yard!
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  service.popular ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {service.popular && (
                  <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{service.icon}</div>
                    {service.seasonal && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {service.seasonal}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">What&apos;s included:</h3>
                    <ul className="space-y-1">
                      {service.includes.map((item, i) => (
                        <li key={i} className="text-gray-600 flex items-center gap-2">
                          <span className="text-green-500">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xl font-bold text-green-600">
                      {service.priceRange}
                    </div>
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition text-sm"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Deal */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              🎉 Regular Service Discount
            </h2>
            <p className="text-xl text-green-100 mb-6">
              Sign up for weekly or bi-weekly mowing and save! Consistent customers get 
              priority scheduling and the best rates.
            </p>
            <Link
              href="/contact?service=Regular+Mowing+Package"
              className="inline-block bg-yellow-400 text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
            >
              Ask About Regular Service
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-gray-800 mb-2">How do I get a quote?</h3>
              <p className="text-gray-600">
                Easy! Just fill out the contact form or text me. Include your address and what services 
                you need, and I&apos;ll get back to you with a price—usually same day.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-gray-800 mb-2">What areas do you serve?</h3>
              <p className="text-gray-600">
                I serve Richmond, VA and surrounding areas including Short Pump, Glen Allen, 
                Henrico, and the West End. If you&apos;re nearby, just ask!
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-gray-800 mb-2">Do I need to be home?</h3>
              <p className="text-gray-600">
                Nope! As long as I can access your yard, you&apos;re good. I&apos;ll text you when I arrive 
                and send photos when I&apos;m done.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-gray-800 mb-2">How do I pay?</h3>
              <p className="text-gray-600">
                I accept Venmo, Zelle, Cash App, or cash. Invoice sent after each service—pay when 
                it&apos;s convenient for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Your best-looking lawn is just one quote away.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-yellow-400 text-green-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
