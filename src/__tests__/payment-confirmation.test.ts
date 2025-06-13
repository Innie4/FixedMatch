import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/payment-confirmations/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { uploadToS3 } from '@/lib/s3';
import { sendEmail } from '@/lib/email';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    paymentConfirmation: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock S3 upload
vi.mock('@/lib/s3', () => ({
  uploadToS3: vi.fn(),
}));

// Mock email service
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
}));

describe('Payment Confirmation API', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
  };

  const mockPaymentConfirmation = {
    id: '1',
    userId: '1',
    packageId: '1',
    amount: 100,
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue({ user: mockUser });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/payment-confirmations', () => {
    it('should create payment confirmation', async () => {
      const formData = new FormData();
      formData.append('packageId', '1');
      formData.append('paymentMethod', 'BANK_TRANSFER');
      formData.append('amount', '100');
      formData.append('file', new Blob(['test'], { type: 'image/jpeg' }));

      const request = new NextRequest('http://localhost:3000/api/payment-confirmations', {
        method: 'POST',
        body: formData,
      });

      (uploadToS3 as any).mockResolvedValue('https://example.com/image.jpg');
      (prisma.paymentConfirmation.create as any).mockResolvedValue(mockPaymentConfirmation);
      (sendEmail as any).mockResolvedValue(true);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentConfirmation);
      expect(uploadToS3).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should handle missing file', async () => {
      const formData = new FormData();
      formData.append('packageId', '1');
      formData.append('paymentMethod', 'BANK_TRANSFER');
      formData.append('amount', '100');

      const request = new NextRequest('http://localhost:3000/api/payment-confirmations', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Payment proof image is required');
    });

    it('should handle invalid file type', async () => {
      const formData = new FormData();
      formData.append('packageId', '1');
      formData.append('paymentMethod', 'BANK_TRANSFER');
      formData.append('amount', '100');
      formData.append('file', new Blob(['test'], { type: 'application/pdf' }));

      const request = new NextRequest('http://localhost:3000/api/payment-confirmations', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Only image files are allowed');
    });
  });

  describe('GET /api/payment-confirmations', () => {
    it('should get payment confirmations', async () => {
      const request = new NextRequest('http://localhost:3000/api/payment-confirmations', {
        method: 'GET',
      });

      (prisma.paymentConfirmation.findMany as any).mockResolvedValue([mockPaymentConfirmation]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPaymentConfirmation]);
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/payment-confirmations', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should filter by status', async () => {
      const request = new NextRequest('http://localhost:3000/api/payment-confirmations?status=PENDING', {
        method: 'GET',
      });

      (prisma.paymentConfirmation.findMany as any).mockResolvedValue([mockPaymentConfirmation]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPaymentConfirmation]);
      expect(prisma.paymentConfirmation.findMany).toHaveBeenCalledWith({
        where: {
          userId: '1',
          status: 'PENDING',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });
}); 