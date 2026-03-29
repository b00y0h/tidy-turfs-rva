'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ContactForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service') || ''
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: preselectedService,
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }))
    }
  }, [preselectedService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission - in production, this would send to an API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Request Sent!</h3>
        <p className="text-green-700 mb-4">
          Thanks for reaching out! I&apos;ll get back to you within 24 hours (usually much faster).
        </p>
        <p className="text-green-600 text-sm">
          📱 For fastest response, feel free to text me directly!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            placeholder="(804) 555-1234"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="john@email.com"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Service Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="123 Main St, Richmond, VA 23220"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
          Service Needed *
        </label>
        <select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="">Select a service...</option>
          <option value="Lawn Mowing & Edging">Lawn Mowing & Edging</option>
          <option value="Trimming & Hedge Work">Trimming & Hedge Work</option>
          <option value="Leaf Removal">Leaf Removal</option>
          <option value="Mulching">Mulching</option>
          <option value="Spring/Fall Cleanup">Spring/Fall Cleanup</option>
          <option value="Basic Landscaping">Basic Landscaping</option>
          <option value="Regular Mowing Package">Regular Mowing Package (Weekly/Bi-Weekly)</option>
          <option value="Multiple Services">Multiple Services</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Tell me about your yard—approximate size, any specific needs, preferred schedule, etc."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Quote Request'}
      </button>

      <p className="text-center text-sm text-gray-500">
        I typically respond within a few hours. No spam, ever.
      </p>
    </form>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Free Quote
          </h1>
          <p className="text-xl text-green-100">
            Tell me about your lawn and I&apos;ll send you an honest price—no pressure, no obligations.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Request a Quote
                </h2>
                <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  📱 Prefer to Text?
                </h3>
                <p className="text-gray-600 mb-4">
                  Texting is the fastest way to reach me. I usually reply within minutes!
                </p>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">Text me anytime:</p>
                  <p className="text-xl font-bold text-green-700">📲 Text for Quote</p>
                </div>
              </div>

              {/* Service Area */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  📍 Service Area
                </h3>
                <p className="text-gray-600 mb-3">
                  I proudly serve:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Richmond
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Short Pump
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Glen Allen
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Henrico
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> West End
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  Not sure if I cover your area? Just ask!
                </p>
              </div>

              {/* What Happens Next */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  What Happens Next?
                </h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span className="text-gray-600">I&apos;ll review your request (same day)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span className="text-gray-600">I&apos;ll send you a custom quote</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span className="text-gray-600">If it works, we schedule your service</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span className="text-gray-600">I show up and make your lawn look amazing!</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
