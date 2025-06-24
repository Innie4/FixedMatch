import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/packages/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    package: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Packages API', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN',
  };

  const mockPackage = {
    id: '1',
    name: 'Premium',
    price: 100,
    features: ['feature1', 'feature2'],
    duration: 30, // days
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue({ user: mockUser });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/packages', () => {
    it('should get packages', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages', {
        method: 'GET',
      });

      (prisma.package.findMany as any).mockResolvedValue([mockPackage]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPackage]);
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/packages', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should filter by price range', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages?minPrice=50&maxPrice=150', {
        method: 'GET',
      });

      (prisma.package.findMany as any).mockResolvedValue([mockPackage]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPackage]);
      expect(prisma.package.findMany).toHaveBeenCalledWith({
        where: {
          price: {
            gte: 50,
            lte: 150,
          },
        },
        orderBy: {
          price: 'asc',
        },
      });
    });
  });
}); 