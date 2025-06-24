import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/predictions/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { requireVIPAccess } from '@/lib/vip-access';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    prediction: {
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

vi.mock('@/lib/vip-access', () => ({
  requireVIPAccess: vi.fn(),
}));

describe('Predictions API', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockPrediction = {
    id: '1',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    prediction: 'Home Win',
    confidence: 'High',
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue({ user: mockUser });
    (requireVIPAccess as any).mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/predictions', () => {
    it('should get predictions', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions', {
        method: 'GET',
      });

      (prisma.prediction.findMany as any).mockResolvedValue([mockPrediction]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPrediction]);
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/predictions', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should filter by league', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions?league=Premier%20League', {
        method: 'GET',
      });

      (prisma.prediction.findMany as any).mockResolvedValue([mockPrediction]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockPrediction]);
      expect(prisma.prediction.findMany).toHaveBeenCalledWith({
        where: {
          league: 'Premier League',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });
}); 