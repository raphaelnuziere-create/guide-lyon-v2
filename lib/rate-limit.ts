import { LRUCache } from 'lru-cache'
import { NextRequest } from 'next/server'

export type RateLimitOptions = {
  interval?: number
  uniqueTokenPerInterval?: number
}

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

function getIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  const xri = request.headers.get('x-real-ip')
  const cfIp = request.headers.get('cf-connecting-ip')
  
  return cfIp || (xff ? xff.split(',')[0].trim() : xri) || '127.0.0.1'
}

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>
  private interval: number
  private uniqueTokenPerInterval: number
  
  constructor(options?: RateLimitOptions) {
    this.interval = options?.interval ?? 60000
    this.uniqueTokenPerInterval = options?.uniqueTokenPerInterval ?? 500
    this.tokenCache = new LRUCache<string, number[]>({
      max: this.uniqueTokenPerInterval,
      ttl: this.interval,
    })
  }
  
  async check(
    request: NextRequest,
    limit: number,
    token?: string
  ): Promise<RateLimitResult> {
    const identifier = token || getIP(request)
    const now = Date.now()
    const timestamps = this.tokenCache.get(identifier) || []
    
    const windowStart = now - this.interval
    const validTimestamps = timestamps.filter(ts => ts > windowStart)
    
    if (validTimestamps.length >= limit) {
      const oldestTimestamp = validTimestamps[0]
      const reset = oldestTimestamp + this.interval
      
      return {
        success: false,
        limit,
        remaining: 0,
        reset,
      }
    }
    
    validTimestamps.push(now)
    this.tokenCache.set(identifier, validTimestamps)
    
    return {
      success: true,
      limit,
      remaining: limit - validTimestamps.length,
      reset: now + this.interval,
    }
  }
  
  reset(token?: string): void {
    if (token) {
      this.tokenCache.delete(token)
    } else {
      this.tokenCache.clear()
    }
  }
}

const defaultRateLimiter = new RateLimiter()

export async function rateLimit(
  request: NextRequest,
  options?: {
    limit?: number
    interval?: number
    uniqueTokenPerInterval?: number
    token?: string
  }
): Promise<RateLimitResult> {
  const limit = options?.limit ?? 10
  const token = options?.token
  
  if (options?.interval || options?.uniqueTokenPerInterval) {
    const customLimiter = new RateLimiter({
      interval: options.interval,
      uniqueTokenPerInterval: options.uniqueTokenPerInterval,
    })
    return customLimiter.check(request, limit, token)
  }
  
  return defaultRateLimiter.check(request, limit, token)
}

export function createRateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
  })
  
  if (!result.success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers,
    })
  }
  
  return new Response(null, { headers })
}