import { LRUCache } from 'lru-cache'

export interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  })

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0]
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1])
      } else {
        tokenCount[0] += 1
        tokenCache.set(token, tokenCount)
      }
      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage >= limit
      return { isRateLimited, currentUsage }
    },
  }
}
