/**
 * One-time: create a stable test admin user for verify-s02.sh
 * Run: npx tsx --no-cache src/seed/createVerifyAdmin.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  const email = 'admin@s02verify.test'
  const password = 's02verify-pass'

  try {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id as unknown as number,
        data: { password },
      })
      console.log(`Updated user: ${email}`)
    } else {
      await payload.create({
        collection: 'users',
        data: { email, password },
      })
      console.log(`Created user: ${email}`)
    }
    console.log(`LOGIN: ${email} / ${password}`)
  } catch (e) {
    console.error('Error:', e)
    process.exit(1)
  }

  process.exit(0)
}

main()
