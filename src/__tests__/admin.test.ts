import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getUsers, PUT as updateUser } from '@/app/api/admin/users/route';
import { GET as getStats } from '@/app/api/admin/stats/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    prediction: {
      count: vi.fn(),
    },
    paymentConfirmation: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    vipSubscription: {
      count: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Admin API', () => {
  const mockAdmin = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
  };

  const mockUser = {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'USER',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue({ user: mockAdmin });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/admin/users', () => {
    it('should get users', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'GET',
      });

      (prisma.user.findMany as any).mockResolvedValue([mockUser]);

      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockUser]);
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'GET',
      });

      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should require admin role', async () => {
      (getServerSession as any).mockResolvedValue({
        user: { ...mockUser, role: 'USER' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'GET',
      });

      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should filter users by status', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users?status=ACTIVE', {
        method: 'GET',
      });

      (prisma.user.findMany as any).mockResolvedValue([mockUser]);

      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockUser]);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          status: 'ACTIVE',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('should update user', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users/2', {
        method: 'PUT',
        body: JSON.stringify({
          status: 'SUSPENDED',
        }),
      });

      (prisma.user.update as any).mockResolvedValue({
        ...mockUser,
        status: 'SUSPENDED',
      });

      const response = await updateUser(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUser,
        status: 'SUSPENDED',
      });
    });

    it('should handle non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users/999', {
        method: 'PUT',
        body: JSON.stringify({
          status: 'SUSPENDED',
        }),
      });

      (prisma.user.update as any).mockRejectedValue(new Error('Record not found'));

      const response = await updateUser(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should get admin stats', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/stats', {
        method: 'GET',
      });

      (prisma.user.count as any).mockResolvedValue(100);
      (prisma.prediction.count as any).mockResolvedValue(500);
      (prisma.paymentConfirmation.count as any).mockResolvedValue(50);
      (prisma.vipSubscription.count as any).mockResolvedValue(30);
      (prisma.paymentConfirmation.findMany as any).mockResolvedValue([
        { amount: 100 },
        { amount: 200 },
      ]);

      const response = await getStats(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        totalUsers: 100,
        totalPredictions: 500,
        totalPayments: 50,
        totalVIPSubscriptions: 30,
        totalRevenue: 300,
      });
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/stats', {
        method: 'GET',
      });

      const response = await getStats(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should require admin role', async () => {
      (getServerSession as any).mockResolvedValue({
        user: { ...mockUser, role: 'USER' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/stats', {
        method: 'GET',
      });

      const response = await getStats(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });
  });
}); 