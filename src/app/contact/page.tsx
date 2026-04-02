'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Step = 1 | 2

function ContactForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service') || ''

  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    contactMethod: '',
    address: '',
    service: preselectedService,
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }))
    }
  }, [preselectedService])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email address is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleBack = () => setStep(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Request Sent!</h3>
        <p className="text-green-700 mb-4">
          Thanks for reaching out! I&apos;ll get back to you within 24 hours with a personalized quote.
        </p>
        <p className="text-green-600 text-sm">
          📱 For fastest response, feel free to text me directly!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-green-700' : 'text-gray-400'}`}>
            Your Info
          </span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-green-700' : 'text-gray-400'}`}>
            Service Details
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} focus:ring-2 transition`}
              placeholder="John Smith"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} focus:ring-2 transition`}
              placeholder="john@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} focus:ring-2 transition`}
              placeholder="(804) 555-1234"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Contact Method
            </label>
            <div className="space-y-3">
              {['Phone', 'Email', 'Text Message'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    formData.contactMethod === method
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={formData.contactMethod === method}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition"
          >
            Next →
          </button>

          <p className="text-center text-xs text-gray-400">
            Never submit passwords through this form.
          </p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Service Address <span className="text-red-500">*</span>
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

          {/* Service */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Needed <span className="text-red-500">*</span>
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
              <option value="Lawn Mowing & Edging">Lawn Mowing &amp; Edging</option>
              <option value="Trimming & Hedge Work">Trimming &amp; Hedge Work</option>
              <option value="Leaf Removal">Leaf Removal</option>
              <option value="Mulching">Mulching</option>
              <option value="Spring/Fall Cleanup">Spring/Fall Cleanup</option>
              <option value="Basic Landscaping">Basic Landscaping</option>
              <option value="Regular Mowing Package">Regular Mowing Package (Weekly/Bi-Weekly)</option>
              <option value="Multiple Services">Multiple Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
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
              placeholder="Tell me about your yard — approximate size, any specific needs, preferred schedule, etc."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            I typically respond within a few hours. No spam, ever.
          </p>
        </form>
      )}
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Request a Free Quote
          </h1>
          <p className="text-xl text-green-100">
            Thank you for your interest in Tidy Turfs! Fill out the form below and I&apos;ll
            get back to you within 24 hours with a personalized quote.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Loading form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            {/* Sidebar */}
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
                <p className="text-gray-600 mb-3">I proudly serve:</p>
                <ul className="space-y-2 text-gray-600">
                  {['Richmond', 'Short Pump', 'Glen Allen', 'Henrico', 'West End'].map(area => (
                    <li key={area} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {area}
                    </li>
                  ))}
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
                  {[
                    "I'll review your request (same day)",
                    "I'll send you a custom quote",
                    'If it works, we schedule your service',
                    'I show up and make your lawn look amazing!',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
