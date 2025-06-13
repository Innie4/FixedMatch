import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/predictions/route';
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

  describe('POST /api/predictions', () => {
    it('should create prediction', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions', {
        method: 'POST',
        body: JSON.stringify({
          league: 'Premier League',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          prediction: 'Home Win',
          confidence: 'High',
        }),
      });

      (prisma.prediction.create as any).mockResolvedValue(mockPrediction);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrediction);
      expect(prisma.prediction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          league: 'Premier League',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          prediction: 'Home Win',
          confidence: 'High',
        }),
      });
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions', {
        method: 'POST',
        body: JSON.stringify({
          league: 'Premier League',
          // Missing required fields
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });
  });

  describe('PUT /api/predictions/:id', () => {
    it('should update prediction', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions/1', {
        method: 'PUT',
        body: JSON.stringify({
          prediction: 'Draw',
          confidence: 'Medium',
        }),
      });

      (prisma.prediction.update as any).mockResolvedValue({
        ...mockPrediction,
        prediction: 'Draw',
        confidence: 'Medium',
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockPrediction,
        prediction: 'Draw',
        confidence: 'Medium',
      });
    });

    it('should handle non-existent prediction', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions/999', {
        method: 'PUT',
        body: JSON.stringify({
          prediction: 'Draw',
          confidence: 'Medium',
        }),
      });

      (prisma.prediction.update as any).mockRejectedValue(new Error('Record not found'));

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Prediction not found');
    });
  });

  describe('DELETE /api/predictions/:id', () => {
    it('should delete prediction', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions/1', {
        method: 'DELETE',
      });

      (prisma.prediction.delete as any).mockResolvedValue(mockPrediction);

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrediction);
    });

    it('should handle non-existent prediction', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions/999', {
        method: 'DELETE',
      });

      (prisma.prediction.delete as any).mockRejectedValue(new Error('Record not found'));

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Prediction not found');
    });
  });
}); 