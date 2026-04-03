import Link from 'next/link'

const services = [
  { icon: '🌱', title: 'Lawn Mowing & Edging', desc: 'Crisp lines and a perfect cut, every time.' },
  { icon: '✂️', title: 'Trimming & Hedge Work', desc: 'Keep your shrubs sharp and tidy.' },
  { icon: '🍂', title: 'Leaf Removal', desc: 'Fall cleanup that leaves your yard spotless.' },
  { icon: '🪴', title: 'Mulching', desc: 'Fresh mulch for healthy beds and curb appeal.' },
  { icon: '🧹', title: 'Spring/Fall Cleanup', desc: 'Seasonal prep to keep your lawn thriving.' },
  { icon: '🌿', title: 'Basic Landscaping', desc: 'Simple improvements that make a big impact.' },
]

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Short Pump',
    content: 'Clayton does an amazing job! He\'s reliable, communicates well, and my lawn has never looked better. Love supporting young entrepreneurs!',
    rating: 5,
  },
  {
    name: 'Mike R.',
    location: 'West End',
    content: 'Finally found someone dependable. He shows up when he says he will and does quality work. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Jennifer T.',
    location: 'Glen Allen',
    content: 'Great attention to detail and very professional for his age. Texts me updates and photos after each visit. 10/10!',
    rating: 5,
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-float text-6xl mb-6">🌿</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
            Young. Hungry.<br />
            <span className="text-yellow-300">Your Lawn&apos;s New Best Friend.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-2xl mx-auto">
            Professional lawn care from Richmond&apos;s hardest-working teen entrepreneur.
            Quality work, fair prices, and hustle you can count on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-yellow-400 text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
            >
              Get Your Free Quote →
            </Link>
            <Link 
              href="/services"
              className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition"
            >
              View Services
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span> Free Estimates
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span> Text Updates
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span> Local & Reliable
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span> Richmond, VA
            </div>
          </div>
        </div>
      </section>

      {/* Why TidyTurfs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose TidyTurfs?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              When you hire TidyTurfs, you&apos;re not just getting a lawn service—you&apos;re supporting 
              a young entrepreneur building something real.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hustle & Heart</h3>
              <p className="text-gray-600">
                I show up early, work hard, and take pride in every yard. Your lawn is my reputation.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tech-Forward</h3>
              <p className="text-gray-600">
                Easy online quotes, text updates, and photos of your finished lawn. Modern service, old-school work ethic.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community First</h3>
              <p className="text-gray-600">
                Born and raised in Richmond. When you hire local, you build local. Let&apos;s grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Services That Make Your Lawn Shine
            </h2>
            <p className="text-gray-600">
              From regular mowing to seasonal cleanups—I&apos;ve got you covered.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/services"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              See All Services & Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Richmond Is Saying
            </h2>
            <p className="text-gray-600">
              Real feedback from real neighbors.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-green-50 p-6 rounded-xl"
              >
                <div className="text-yellow-500 mb-3">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a Lawn You&apos;ll Love?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get your free quote in minutes. No pressure, no hassle—just honest pricing.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-yellow-400 text-green-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
          >
            Get Your Free Quote Today
          </Link>
          <a href="sms:8046789158?body=Hi!%20I%27d%20like%20a%20quote%20for%20lawn%20care%20services." className="mt-6 text-green-200 text-sm hover:text-white transition-colors inline-block">
            📱 Prefer to text? That works too—fastest way to reach me!
          </a>
        </div>
      </section>
    </>
  )
}
