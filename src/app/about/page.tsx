import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Clayton | TidyTurfs RVA',
  description: 'Meet Clayton Smith, the 16-year-old entrepreneur behind TidyTurfs RVA. Learn why Richmond\'s hardest-working teen started a lawn care business.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Clayton
          </h1>
          <p className="text-xl text-green-100">
            The 16-year-old behind Richmond&apos;s fastest-growing lawn care service.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Photo placeholder */}
            <div className="md:col-span-2">
              <div className="bg-green-100 rounded-2xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">👨‍🌾</div>
                  <p className="text-green-600 font-medium">Clayton Smith</p>
                  <p className="text-green-500 text-sm">Founder, TidyTurfs RVA</p>
                </div>
              </div>
            </div>
            
            {/* Story */}
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Why I Started TidyTurfs
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Hey, I&apos;m Clayton—a 16-year-old from Richmond who decided to stop waiting for opportunities 
                and start creating them.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                It started simple: I wanted to earn my own money. But as I mowed my first few lawns, 
                I realized I actually loved the work. There&apos;s something satisfying about transforming 
                an overgrown yard into something the homeowner is proud of.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                I&apos;m not just doing this for extra cash (though saving for college doesn&apos;t hurt). 
                I&apos;m building real skills—running a business, managing customers, showing up when I 
                say I will. The kind of stuff you can&apos;t learn in a classroom.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                When you hire TidyTurfs, you get someone who genuinely cares about doing a great job—
                because my name is on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What I Believe In
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Show Up On Time</h3>
              <p className="text-gray-600">
                If I say I&apos;ll be there, I&apos;ll be there. Reliability isn&apos;t just a nice-to-have—it&apos;s everything.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Do It Right</h3>
              <p className="text-gray-600">
                No cutting corners. Every lawn gets my full effort because I want you to text your 
                neighbor about how good it looks.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Communicate</h3>
              <p className="text-gray-600">
                I reply fast, send updates, and make sure you always know what&apos;s happening. 
                No ghosting, no excuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            TidyTurfs By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">16</div>
              <div className="text-gray-600">Years old (and hungry)</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Effort, every time</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">📍</div>
              <div className="text-gray-600">Richmond born & raised</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">💪</div>
              <div className="text-gray-600">Building something real</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Support Young Entrepreneurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🌟 Why Support a Teen Entrepreneur?
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>You&apos;re investing in the next generation.</strong> When you hire a young person 
                who&apos;s actually putting in the work, you&apos;re teaching them that hard work pays off.
              </p>
              <p>
                <strong>You get someone with something to prove.</strong> I don&apos;t have decades of 
                reputation to coast on—every single job matters. That means I work harder.
              </p>
              <p>
                <strong>You support your community.</strong> Your money stays local and helps a 
                Richmond kid build a future. That&apos;s something to feel good about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">💭</div>
          <blockquote className="text-2xl md:text-3xl font-medium italic mb-6">
            &quot;I might be young, but I work like I have something to prove—because I do.&quot;
          </blockquote>
          <p className="text-green-200">— Clayton Smith, Founder</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Give TidyTurfs a Shot?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            I&apos;d love to take care of your lawn. Let&apos;s make it happen.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
