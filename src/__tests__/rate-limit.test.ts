import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import rateLimit from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should allow requests within limit', async () => {
    const token = 'test-token';
    const maxRequests = 5;

    // Make 5 requests
    for (let i = 0; i < maxRequests; i++) {
      await expect(limiter.check(maxRequests, token)).resolves.not.toThrow();
    }
  });

  it('should throw error when limit is exceeded', async () => {
    const token = 'test-token';
    const maxRequests = 5;

    // Make 6 requests
    for (let i = 0; i < maxRequests; i++) {
      await expect(limiter.check(maxRequests, token)).resolves.not.toThrow();
    }

    // 6th request should fail
    await expect(limiter.check(maxRequests, token)).rejects.toThrow('Rate limit exceeded');
  });

  it('should reset limit after interval', async () => {
    const token = 'test-token';
    const maxRequests = 5;

    // Make 5 requests
    for (let i = 0; i < maxRequests; i++) {
      await expect(limiter.check(maxRequests, token)).resolves.not.toThrow();
    }

    // Fast forward time by 1 minute
    vi.advanceTimersByTime(60 * 1000);

    // Should allow requests again
    await expect(limiter.check(maxRequests, token)).resolves.not.toThrow();
  });

  it('should handle different tokens independently', async () => {
    const token1 = 'token-1';
    const token2 = 'token-2';
    const maxRequests = 5;

    // Make 5 requests for token1
    for (let i = 0; i < maxRequests; i++) {
      await expect(limiter.check(maxRequests, token1)).resolves.not.toThrow();
    }

    // token1 should be limited
    await expect(limiter.check(maxRequests, token1)).rejects.toThrow('Rate limit exceeded');

    // token2 should still work
    await expect(limiter.check(maxRequests, token2)).resolves.not.toThrow();
  });

  it('should handle concurrent requests', async () => {
    const token = 'test-token';
    const maxRequests = 5;

    // Make 5 concurrent requests
    const promises = Array(maxRequests)
      .fill(null)
      .map(() => limiter.check(maxRequests, token));

    await expect(Promise.all(promises)).resolves.not.toThrow();

    // Next request should fail
    await expect(limiter.check(maxRequests, token)).rejects.toThrow('Rate limit exceeded');
  });

  it('should handle invalid tokens', async () => {
    const maxRequests = 5;

    await expect(limiter.check(maxRequests, '')).rejects.toThrow('Invalid token');
    await expect(limiter.check(maxRequests, null as any)).rejects.toThrow('Invalid token');
  });

  it('should handle invalid max requests', async () => {
    const token = 'test-token';

    await expect(limiter.check(0, token)).rejects.toThrow('Invalid max requests');
    await expect(limiter.check(-1, token)).rejects.toThrow('Invalid max requests');
  });
}); 