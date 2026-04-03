'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { label: 'Your Info' },
  { label: 'Property' },
  { label: 'Services' },
  { label: 'Details' },
]

const SERVICES = [
  'Lawn Mowing & Maintenance',
  'Lawn Fertilization & Weed Control',
  'Landscaping Design',
  'Garden Bed Installation',
  'Tree & Shrub Trimming',
  'Mulching',
  'Irrigation System Install/Repair',
  'Seasonal Cleanup (Spring/Fall)',
  'Sod Installation',
  'Hardscaping (Patios/Walkways)',
]

function RadioGroup({
  name,
  options,
  value,
  onChange,
  columns = 1,
}: {
  name: string
  options: string[]
  value: string
  onChange: (val: string) => void
  columns?: number
}) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${
            value === opt
              ? 'border-green-500 bg-green-50 text-green-800 font-medium'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-4 h-4 text-green-600 focus:ring-green-500 shrink-0"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function CheckboxGroup({
  name,
  options,
  values,
  onChange,
}: {
  name: string
  options: string[]
  values: string[]
  onChange: (vals: string[]) => void
}) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt))
    } else {
      onChange([...values, opt])
    }
  }
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${
            values.includes(opt)
              ? 'border-green-500 bg-green-50 text-green-800 font-medium'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-4 h-4 text-green-600 focus:ring-green-500 rounded shrink-0"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function ContactForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service') || ''

  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    phone: '',
    contactMethod: '',
    // Step 2
    address: '',
    city: '',
    lawnSize: '',
    propertyType: '',
    // Step 3
    services: preselectedService ? [preselectedService] : [] as string[],
    serviceOther: '',
    frequency: '',
    // Step 4
    startDate: '',
    budget: '',
    hearAboutUs: '',
    hearAboutUsOther: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (preselectedService && !formData.services.includes(preselectedService)) {
      setFormData((prev) => ({ ...prev, services: [preselectedService] }))
    }
  }, [preselectedService])

  const set = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    set(e.target.name, e.target.value)
  }

  const validate = (s: Step) => {
    const errs: Record<string, string> = {}
    if (s === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Required'
      if (!formData.email.trim()) errs.email = 'Required'
      if (!formData.phone.trim()) errs.phone = 'Required'
    }
    if (s === 2) {
      if (!formData.address.trim()) errs.address = 'Required'
      if (!formData.city.trim()) errs.city = 'Required'
    }
    if (s === 3) {
      if (formData.services.length === 0) errs.services = 'Please select at least one service'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validate(step)) setStep((s) => (s + 1) as Step)
  }
  const back = () => setStep((s) => (s - 1) as Step)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) setIsSubmitted(true)
    } catch (err) {
      console.error(err)
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
        <p className="text-green-600 text-sm">📱 For fastest response, feel free to text me directly!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const num = i + 1
          const active = step === num
          const done = step > num
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    done ? 'bg-green-600 text-white' : active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {done ? '✓' : num}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active || done ? 'text-green-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Your Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Smith"
              className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@email.com"
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(804) 555-1234"
              className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
            <RadioGroup
              name="contactMethod"
              options={['Phone', 'Email', 'Text Message']}
              value={formData.contactMethod}
              onChange={(v) => set('contactMethod', v)}
            />
          </div>

          <button type="button" onClick={next} className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition">
            Next →
          </button>
          <p className="text-center text-xs text-gray-400">Never submit passwords through this form.</p>
        </div>
      )}

      {/* Step 2 — Property Details */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Property Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St"
              className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Richmond"
              className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Lawn Size</label>
            <RadioGroup
              name="lawnSize"
              options={['Small - under 2,000 sq ft', 'Medium - 2,000 to 5,000 sq ft', 'Large - 5,000 to 10,000 sq ft', 'Extra Large - over 10,000 sq ft', 'Not Sure']}
              value={formData.lawnSize}
              onChange={(v) => set('lawnSize', v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <RadioGroup
              name="propertyType"
              options={['Residential', 'Commercial']}
              value={formData.propertyType}
              onChange={(v) => set('propertyType', v)}
              columns={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={back} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-200 transition">
              ← Back
            </button>
            <button type="button" onClick={next} className="flex-[2] bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Services */}
      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Services Needed</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Interested In <span className="text-gray-400 font-normal">(select all that apply)</span>
              {errors.services && <span className="text-red-500 text-xs ml-2">{errors.services}</span>}
            </label>
            <CheckboxGroup
              name="services"
              options={SERVICES}
              values={formData.services}
              onChange={(v) => set('services', v)}
            />
            {/* Other */}
            <div className="mt-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.serviceOther !== ''}
                  onChange={(e) => set('serviceOther', e.target.checked ? ' ' : '')}
                  className="w-4 h-4 text-green-600 rounded shrink-0"
                />
                Other
              </label>
              {formData.serviceOther !== '' && (
                <input
                  type="text"
                  name="serviceOther"
                  value={formData.serviceOther.trim()}
                  onChange={(e) => set('serviceOther', e.target.value)}
                  placeholder="Please specify..."
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How often do you need service?</label>
            <RadioGroup
              name="frequency"
              options={['One-Time Service', 'Weekly', 'Bi-Weekly', 'Monthly', 'Seasonal', 'Not Sure Yet']}
              value={formData.frequency}
              onChange={(v) => set('frequency', v)}
              columns={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={back} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-200 transition">
              ← Back
            </button>
            <button type="button" onClick={next} className="flex-[2] bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Additional Info */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Additional Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
            <RadioGroup
              name="budget"
              options={['Under $100/month', '$100 - $250/month', '$250 - $500/month', '$500+/month', 'Not Sure - Need a Quote']}
              value={formData.budget}
              onChange={(v) => set('budget', v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
            <RadioGroup
              name="hearAboutUs"
              options={['Google Search', 'Social Media', 'Neighbor/Friend Referral', 'Yard Sign', 'Nextdoor']}
              value={formData.hearAboutUs}
              onChange={(v) => { set('hearAboutUs', v); set('hearAboutUsOther', '') }}
              columns={2}
            />
            <div className="mt-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="hearAboutUs"
                  checked={formData.hearAboutUsOther !== '' || (!['Google Search','Social Media','Neighbor/Friend Referral','Yard Sign','Nextdoor'].includes(formData.hearAboutUs) && formData.hearAboutUs === 'Other')}
                  onChange={() => { set('hearAboutUs', 'Other'); set('hearAboutUsOther', ' ') }}
                  className="w-4 h-4 text-green-600 shrink-0"
                />
                Other
              </label>
              {formData.hearAboutUs === 'Other' && (
                <input
                  type="text"
                  name="hearAboutUsOther"
                  value={formData.hearAboutUsOther.trim()}
                  onChange={(e) => set('hearAboutUsOther', e.target.value)}
                  placeholder="Please specify..."
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anything else we should know?</label>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Yard details, access info, specific concerns, etc."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={back} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-200 transition">
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

          <p className="text-center text-sm text-gray-500">I typically respond within a few hours. No spam, ever.</p>
        </form>
      )}
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Free Quote</h1>
          <p className="text-xl text-green-100">
            Thank you for your interest in Tidy Turfs! Please fill out the form below and I&apos;ll
            get back to you within 24 hours with a personalized quote.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Loading form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Prefer to Text?</h3>
                <p className="text-gray-600 mb-4">Texting is the fastest way to reach me. I usually reply within minutes!</p>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">Text me anytime:</p>
                  <p className="text-xl font-bold text-green-700">📲 Text for Quote</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📍 Service Area</h3>
                <p className="text-gray-600 mb-3">I proudly serve:</p>
                <ul className="space-y-2 text-gray-600">
                  {['Richmond', 'Short Pump', 'Glen Allen', 'Henrico', 'West End'].map((area) => (
                    <li key={area} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {area}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-3">Not sure if I cover your area? Just ask!</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">What Happens Next?</h3>
                <ol className="space-y-3">
                  {[
                    "I'll review your request (same day)",
                    "I'll send you a custom quote",
                    'If it works, we schedule your service',
                    'I show up and make your lawn look amazing!',
                  ].map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <span className="text-gray-600">{s}</span>
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
