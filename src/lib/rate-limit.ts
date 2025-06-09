import LRUCache from 'lru-cache'
import { NextRequest, NextResponse } from 'next/server'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60 * 1000, // 60 seconds
  })

  return {
    check: (res: NextResponse, numRequestsPerInterval: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0]
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount)
      }
      tokenCount[0]++

      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage >= numRequestsPerInterval

      res.headers.set('X-RateLimit-Limit', String(numRequestsPerInterval))
      res.headers.set(
        'X-RateLimit-Remaining',
        String(Math.max(0, numRequestsPerInterval - currentUsage))
      )

      return !isRateLimited
    },
  }
}
