/**
 * Idempotent seed script: creates (or updates) the Contact Form document in Payload.
 *
 * The Form contains all 16 fields that the frontend contact page collects,
 * mapped to the correct @payloadcms/plugin-form-builder block types.
 *
 * Run:  npm run seed:form
 *
 * After success the form's ID is printed to stdout and written to .form-id
 * so downstream scripts (e.g. T03) can reference it without querying.
 */

import path from 'path'
import { writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

// ── Lexical helpers ─────────────────────────────────────────────────────────
// Payload's email message field is a Lexical rich-text blob.
// We use the minimal valid structure: root → paragraph → text.
function lexicalText(text: string): object {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text,
              version: 1,
            },
          ],
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
    },
  }
}

// ── Field definitions ────────────────────────────────────────────────────────
// Option values MUST match what the frontend sends — the RadioGroup/CheckboxGroup
// components use the display string directly as the submitted value.

const fields = [
  // ── Step 1: Your Info ──────────────────────────────────────────────────
  {
    blockType: 'text' as const,
    name: 'fullName',
    label: 'Full Name',
    required: true,
  },
  {
    blockType: 'email' as const,
    name: 'email',
    label: 'Email Address',
    required: true,
  },
  {
    blockType: 'text' as const,
    name: 'phone',
    label: 'Phone Number',
    required: true,
  },
  {
    blockType: 'select' as const,
    name: 'contactMethod',
    label: 'Preferred Contact Method',
    required: false,
    options: [
      { label: 'Phone', value: 'Phone' },
      { label: 'Email', value: 'Email' },
      { label: 'Text Message', value: 'Text Message' },
    ],
  },
  // ── Step 2: Property ───────────────────────────────────────────────────
  {
    blockType: 'text' as const,
    name: 'address',
    label: 'Property Address',
    required: true,
  },
  {
    blockType: 'text' as const,
    name: 'city',
    label: 'City',
    required: true,
  },
  {
    blockType: 'select' as const,
    name: 'lawnSize',
    label: 'Approximate Lawn Size',
    required: false,
    options: [
      { label: 'Small - under 2,000 sq ft', value: 'Small - under 2,000 sq ft' },
      { label: 'Medium - 2,000 to 5,000 sq ft', value: 'Medium - 2,000 to 5,000 sq ft' },
      { label: 'Large - 5,000 to 10,000 sq ft', value: 'Large - 5,000 to 10,000 sq ft' },
      { label: 'Extra Large - over 10,000 sq ft', value: 'Extra Large - over 10,000 sq ft' },
      { label: 'Not Sure', value: 'Not Sure' },
    ],
  },
  {
    blockType: 'select' as const,
    name: 'propertyType',
    label: 'Property Type',
    required: false,
    options: [
      { label: 'Residential', value: 'Residential' },
      { label: 'Commercial', value: 'Commercial' },
    ],
  },
  // ── Step 3: Services ───────────────────────────────────────────────────
  // The frontend sends services as a comma-joined string (array joined client-side).
  // We use textarea so the full list is captured as-is.
  {
    blockType: 'textarea' as const,
    name: 'services',
    label: 'Services Interested In',
    required: true,
  },
  {
    blockType: 'text' as const,
    name: 'serviceOther',
    label: 'Other Service (specify)',
    required: false,
  },
  {
    blockType: 'select' as const,
    name: 'frequency',
    label: 'Service Frequency',
    required: false,
    options: [
      { label: 'One-Time Service', value: 'One-Time Service' },
      { label: 'Weekly', value: 'Weekly' },
      { label: 'Bi-Weekly', value: 'Bi-Weekly' },
      { label: 'Monthly', value: 'Monthly' },
      { label: 'Seasonal', value: 'Seasonal' },
      { label: 'Not Sure Yet', value: 'Not Sure Yet' },
    ],
  },
  // ── Step 4: Additional Info ────────────────────────────────────────────
  {
    blockType: 'text' as const,
    name: 'startDate',
    label: 'Preferred Start Date',
    required: false,
  },
  {
    blockType: 'select' as const,
    name: 'budget',
    label: 'Budget Range',
    required: false,
    options: [
      { label: 'Under $100/month', value: 'Under $100/month' },
      { label: '$100 - $250/month', value: '$100 - $250/month' },
      { label: '$250 - $500/month', value: '$250 - $500/month' },
      { label: '$500+/month', value: '$500+/month' },
      { label: 'Not Sure - Need a Quote', value: 'Not Sure - Need a Quote' },
    ],
  },
  {
    blockType: 'select' as const,
    name: 'hearAboutUs',
    label: 'How Did You Hear About Us?',
    required: false,
    options: [
      { label: 'Google Search', value: 'Google Search' },
      { label: 'Social Media', value: 'Social Media' },
      { label: 'Neighbor/Friend Referral', value: 'Neighbor/Friend Referral' },
      { label: 'Yard Sign', value: 'Yard Sign' },
      { label: 'Nextdoor', value: 'Nextdoor' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    blockType: 'text' as const,
    name: 'hearAboutUsOther',
    label: 'How Did You Hear About Us? (Other)',
    required: false,
  },
  {
    blockType: 'textarea' as const,
    name: 'notes',
    label: 'Anything Else We Should Know?',
    required: false,
  },
]

// 16 fields total:
// text:     fullName, phone, address, city, serviceOther, startDate, hearAboutUsOther  → 7
// email:    email                                                                       → 1
// select:   contactMethod, lawnSize, propertyType, frequency, budget, hearAboutUs      → 6
// textarea: services, notes                                                             → 2

// ── Email notification ───────────────────────────────────────────────────────
const emails = [
  {
    emailTo: 'tidyturfrva@gmail.com',
    emailFrom: 'Tidy Turfs RVA <bobby@reversetype.com>',
    subject: 'New Quote Request from {{fullName}}',
    message: lexicalText('{{*:table}}'),
    replyTo: '{{email}}',
  },
]

// ── Confirmation message (Lexical) ───────────────────────────────────────────
const confirmationMessage = lexicalText(
  "Thank you for your quote request! I'll review your information and get back to you within 24 hours with a personalized quote.",
)

// ── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  const payload = await getPayload({ config })

  // Query first to support idempotent upsert
  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact Form' } },
    limit: 1,
  })

  const formData = {
    title: 'Contact Form',
    fields,
    emails,
    confirmationType: 'message' as const,
    confirmationMessage,
    submitButtonLabel: 'Get My Free Quote',
  }

  let formId: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = formData as any

  if (existing.docs.length > 0) {
    const id = String(existing.docs[0]!.id)
    await payload.update({
      collection: 'forms',
      id,
      data,
    })
    formId = id
    console.log(`[seed:form] Updated existing Contact Form — id: ${formId}`)
  } else {
    const created = await payload.create({
      collection: 'forms',
      data,
    })
    formId = String(created.id)
    console.log(`[seed:form] Created new Contact Form — id: ${formId}`)
  }

  // Write form ID to .form-id for downstream reference
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const rootDir = path.resolve(__dirname, '../../')
  await writeFile(path.join(rootDir, '.form-id'), formId, 'utf-8')
  console.log(`[seed:form] Form ID written to .form-id`)

  process.exit(0)
}

seed().catch((err) => {
  console.error('[seed:form] Fatal error:', err)
  process.exit(1)
})
