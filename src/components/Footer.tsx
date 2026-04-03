import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <div>
                <span className="text-xl font-bold">TidyTurfs</span>
                <span className="text-xl font-bold text-green-300"> RVA</span>
              </div>
            </div>
            <p className="text-green-200 text-sm">
              Young. Hungry. Your Lawn&apos;s New Best Friend.
            </p>
            <p className="text-green-200 text-sm mt-2">
              Proudly serving Richmond, VA and surrounding areas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-green-200 hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-green-200 hover:text-white transition">
                  About Clayton
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 hover:text-white transition">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Get In Touch</h3>
            <div className="space-y-2 text-green-200">
              <p className="flex items-center gap-2">
                <span>📍</span> Richmond, VA
              </p>
              <p className="flex items-center gap-2">
                <span>📱</span> Text for fastest response
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span> <a href="mailto:tidyturfrva@gmail.com">tidyturfrva@gmail.com</a>
              </p>
            </div>
            <Link 
              href="/contact"
              className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-500 transition"
            >
              Request Quote
            </Link>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-300 text-sm">
          <p>© {new Date().getFullYear()} TidyTurfs RVA. All rights reserved.</p>
          <p className="mt-1">Built with 💪 by Richmond&apos;s hardest-working teen.</p>
        </div>
      </div>
    </footer>
  )
}
