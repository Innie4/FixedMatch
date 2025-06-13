import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkVIPAccess, requireVIPAccess, activateVIPAccess, deactivateVIPAccess } from '@/lib/vip-access';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    vipSubscription: {
      create: vi.fn(),
      update: vi.fn(),
    },
    vipAccessLog: {
      create: vi.fn(),
    },
  },
}));

describe('VIP Access', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    vipSubscription: {
      isActive: true,
      expiryDate: new Date(Date.now() + 86400000), // 1 day from now
      package: {
        name: 'Premium',
        features: ['feature1', 'feature2'],
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue({ user: { id: '1' } });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('checkVIPAccess', () => {
    it('should return VIP access details for active subscription', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await checkVIPAccess('1');

      expect(result).toEqual({
        isActive: true,
        expiryDate: mockUser.vipSubscription.expiryDate,
        package: mockUser.vipSubscription.package,
        features: mockUser.vipSubscription.package.features,
      });
    });

    it('should return inactive status for non-VIP user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        ...mockUser,
        vipSubscription: null,
      });

      const result = await checkVIPAccess('1');

      expect(result).toEqual({
        isActive: false,
        expiryDate: null,
        package: null,
        features: [],
      });
    });
  });

  describe('requireVIPAccess', () => {
    it('should throw error for non-authenticated user', async () => {
      (getServerSession as any).mockResolvedValue(null);

      await expect(requireVIPAccess()).rejects.toThrow('Authentication required');
    });

    it('should throw error for non-VIP user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        ...mockUser,
        vipSubscription: null,
      });

      await expect(requireVIPAccess()).rejects.toThrow('VIP access required');
    });

    it('should return user for VIP user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await requireVIPAccess();

      expect(result).toEqual(mockUser);
    });
  });

  describe('activateVIPAccess', () => {
    it('should activate VIP access for user', async () => {
      const packageId = '1';
      const expiryDate = new Date(Date.now() + 86400000);

      (prisma.vipSubscription.create as any).mockResolvedValue({
        id: '1',
        userId: '1',
        packageId,
        isActive: true,
        expiryDate,
      });

      (prisma.vipAccessLog.create as any).mockResolvedValue({
        id: '1',
        userId: '1',
        action: 'ACTIVATED',
      });

      const result = await activateVIPAccess('1', packageId, expiryDate);

      expect(result).toEqual({
        id: '1',
        userId: '1',
        packageId,
        isActive: true,
        expiryDate,
      });

      expect(prisma.vipAccessLog.create).toHaveBeenCalledWith({
        data: {
          userId: '1',
          action: 'ACTIVATED',
        },
      });
    });
  });

  describe('deactivateVIPAccess', () => {
    it('should deactivate VIP access for user', async () => {
      (prisma.vipSubscription.update as any).mockResolvedValue({
        id: '1',
        userId: '1',
        isActive: false,
      });

      (prisma.vipAccessLog.create as any).mockResolvedValue({
        id: '1',
        userId: '1',
        action: 'DEACTIVATED',
      });

      const result = await deactivateVIPAccess('1');

      expect(result).toEqual({
        id: '1',
        userId: '1',
        isActive: false,
      });

      expect(prisma.vipAccessLog.create).toHaveBeenCalledWith({
        data: {
          userId: '1',
          action: 'DEACTIVATED',
        },
      });
    });
  });
}); 