import { unstable_cache } from 'next/cache'
import { cache } from 'react'

export const CACHE_TAGS = {
  all: 'all',
  articles: 'articles',
  article: (slug: string) => `article:${slug}`,
  places: 'places',
  place: (id: string) => `place:${id}`,
  events: 'events',
  event: (id: string) => `event:${id}`,
  categories: 'categories',
  category: (slug: string) => `category:${slug}`,
  homepage: 'homepage',
  navigation: 'navigation',
  footer: 'footer',
  seo: 'seo',
} as const

export const CACHE_TIMES = {
  default: 3600,
  short: 300,
  medium: 1800,
  long: 7200,
  day: 86400,
  week: 604800,
} as const

export function cacheWrapper<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    tags?: string[]
    revalidate?: number | false
    key?: string
  }
): T {
  const { tags = [], revalidate = CACHE_TIMES.default, key } = options || {}
  
  return unstable_cache(
    fn,
    key ? [key] : undefined,
    {
      tags: [CACHE_TAGS.all, ...tags],
      revalidate,
    }
  ) as T
}

export const memoize = cache

export async function revalidateCache(tags: string | string[]) {
  const { revalidateTag } = await import('next/cache')
  
  const tagsArray = Array.isArray(tags) ? tags : [tags]
  
  await Promise.all(tagsArray.map(tag => revalidateTag(tag)))
}

export async function clearAllCache() {
  const { revalidatePath } = await import('next/cache')
  
  await revalidatePath('/', 'layout')
}

interface CachedFetchOptions extends RequestInit {
  tags?: string[]
  revalidate?: number | false
}

export async function cachedFetch(
  url: string,
  options?: CachedFetchOptions
): Promise<Response> {
  const { tags = [], revalidate = CACHE_TIMES.default, ...fetchOptions } = options || {}
  
  return fetch(url, {
    ...fetchOptions,
    next: {
      tags: [CACHE_TAGS.all, ...tags],
      revalidate,
    },
  })
}

export function getCacheKey(...parts: (string | number | undefined)[]) {
  return parts.filter(Boolean).join(':')
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  
  set<T>(key: string, data: T, ttl: number = CACHE_TIMES.default): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000,
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) return false
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    
    if (isExpired) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
}

export const memoryCache = new InMemoryCache()