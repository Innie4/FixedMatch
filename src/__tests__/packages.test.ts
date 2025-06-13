import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/packages/route';
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

  describe('POST /api/packages', () => {
    it('should create package', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Premium',
          price: 100,
          features: ['feature1', 'feature2'],
          duration: 30,
        }),
      });

      (prisma.package.create as any).mockResolvedValue(mockPackage);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPackage);
      expect(prisma.package.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Premium',
          price: 100,
          features: ['feature1', 'feature2'],
          duration: 30,
        }),
      });
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Premium',
          // Missing required fields
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should require admin role', async () => {
      (getServerSession as any).mockResolvedValue({
        user: { ...mockUser, role: 'USER' },
      });

      const request = new NextRequest('http://localhost:3000/api/packages', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Premium',
          price: 100,
          features: ['feature1', 'feature2'],
          duration: 30,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });
  });

  describe('PUT /api/packages/:id', () => {
    it('should update package', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages/1', {
        method: 'PUT',
        body: JSON.stringify({
          price: 150,
          features: ['feature1', 'feature2', 'feature3'],
        }),
      });

      (prisma.package.update as any).mockResolvedValue({
        ...mockPackage,
        price: 150,
        features: ['feature1', 'feature2', 'feature3'],
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockPackage,
        price: 150,
        features: ['feature1', 'feature2', 'feature3'],
      });
    });

    it('should handle non-existent package', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages/999', {
        method: 'PUT',
        body: JSON.stringify({
          price: 150,
        }),
      });

      (prisma.package.update as any).mockRejectedValue(new Error('Record not found'));

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Package not found');
    });
  });

  describe('DELETE /api/packages/:id', () => {
    it('should delete package', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages/1', {
        method: 'DELETE',
      });

      (prisma.package.delete as any).mockResolvedValue(mockPackage);

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPackage);
    });

    it('should handle non-existent package', async () => {
      const request = new NextRequest('http://localhost:3000/api/packages/999', {
        method: 'DELETE',
      });

      (prisma.package.delete as any).mockRejectedValue(new Error('Record not found'));

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Package not found');
    });
  });
}); 