import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as forgotPassword } from '@/app/api/auth/forgot-password/route';
import { POST as resetPassword } from '@/app/api/auth/reset-password/route';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import rateLimit from '@/lib/rate-limit';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({
    check: vi.fn(),
  })),
}));

describe('Authentication API', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue({
        ...mockUser,
        resetToken: 'test-token',
        resetTokenExpiry: new Date(Date.now() + 3600000),
      });
      (sendEmail as any).mockResolvedValue(true);
      (rateLimit as any)().check.mockResolvedValue(true);

      const response = await forgotPassword(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Password reset email sent');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: expect.objectContaining({
          resetToken: expect.any(String),
          resetTokenExpiry: expect.any(Date),
        }),
      });
      expect(sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        template: 'passwordReset',
        data: expect.objectContaining({
          resetLink: expect.any(String),
        }),
      });
    });

    it('should handle non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'nonexistent@example.com' }),
      });

      (prisma.user.findUnique as any).mockResolvedValue(null);
      (rateLimit as any)().check.mockResolvedValue(true);

      const response = await forgotPassword(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Password reset email sent');
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should handle rate limiting', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      (rateLimit as any)().check.mockRejectedValue(new Error('Rate limit exceeded'));

      const response = await forgotPassword(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Rate limit exceeded');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          password: 'new-password',
        }),
      });

      (prisma.user.findUnique as any).mockResolvedValue({
        ...mockUser,
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 3600000),
      });
      (prisma.user.update as any).mockResolvedValue({
        ...mockUser,
        resetToken: null,
        resetTokenExpiry: null,
      });

      const response = await resetPassword(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Password reset successful');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { resetToken: 'valid-token' },
        data: expect.objectContaining({
          password: expect.any(String),
          resetToken: null,
          resetTokenExpiry: null,
        }),
      });
    });

    it('should handle invalid token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: 'invalid-token',
          password: 'new-password',
        }),
      });

      (prisma.user.findUnique as any).mockResolvedValue(null);

      const response = await resetPassword(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid or expired reset token');
    });

    it('should handle expired token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: 'expired-token',
          password: 'new-password',
        }),
      });

      (prisma.user.findUnique as any).mockResolvedValue({
        ...mockUser,
        resetToken: 'expired-token',
        resetTokenExpiry: new Date(Date.now() - 3600000),
      });

      const response = await resetPassword(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid or expired reset token');
    });

    it('should validate password requirements', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          password: 'weak',
        }),
      });

      const response = await resetPassword(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Password must be at least 8 characters long');
    });
  });
}); 