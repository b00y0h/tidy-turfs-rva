import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let adminLimiter: Ratelimit | null = null
let apiLimiter: Ratelimit | null = null

function getLimiters() {
  if (adminLimiter && apiLimiter) return { adminLimiter, apiLimiter }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new Redis({ url, token })

  adminLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'ratelimit:admin',
  })

  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    prefix: 'ratelimit:api',
  })

  return { adminLimiter, apiLimiter }
}

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export async function middleware(request: NextRequest) {
  const limiters = getLimiters()
  if (!limiters) return NextResponse.next()

  const { pathname } = request.nextUrl
  const ip = getIP(request)

  // Rate limit admin routes (login page, dashboard)
  if (pathname.startsWith('/admin')) {
    const { success, remaining } = await limiters.adminLimiter.limit(ip)
    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' },
      })
    }
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }

  // Rate limit API routes (Payload REST API, form submissions)
  if (pathname.startsWith('/api')) {
    const { success, remaining } = await limiters.apiLimiter.limit(ip)
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      })
    }
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
