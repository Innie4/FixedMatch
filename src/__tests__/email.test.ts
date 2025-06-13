import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendEmail } from '@/lib/email';
import sgMail from '@sendgrid/mail';

// Mock SendGrid
vi.mock('@sendgrid/mail', () => ({
  setApiKey: vi.fn(),
  send: vi.fn(),
}));

describe('Email Service', () => {
  const mockEmailOptions = {
    to: 'test@example.com',
    template: 'welcome' as const,
    data: {
      name: 'Test User',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SENDGRID_API_KEY = 'test-api-key';
    process.env.EMAIL_FROM = 'noreply@predicts.com';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should send welcome email', async () => {
    (sgMail.send as any).mockResolvedValue([{ statusCode: 202 }]);

    const result = await sendEmail(mockEmailOptions);

    expect(result).toBe(true);
    expect(sgMail.setApiKey).toHaveBeenCalledWith('test-api-key');
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'noreply@predicts.com',
      templateId: expect.any(String),
      dynamicTemplateData: {
        name: 'Test User',
      },
    });
  });

  it('should send password reset email', async () => {
    const resetOptions = {
      to: 'test@example.com',
      template: 'passwordReset' as const,
      data: {
        resetLink: 'https://example.com/reset',
      },
    };

    (sgMail.send as any).mockResolvedValue([{ statusCode: 202 }]);

    const result = await sendEmail(resetOptions);

    expect(result).toBe(true);
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'noreply@predicts.com',
      templateId: expect.any(String),
      dynamicTemplateData: {
        resetLink: 'https://example.com/reset',
      },
    });
  });

  it('should send payment confirmation email', async () => {
    const paymentOptions = {
      to: 'test@example.com',
      template: 'paymentConfirmation' as const,
      data: {
        amount: 100,
        packageName: 'Premium',
        paymentMethod: 'BANK_TRANSFER',
      },
    };

    (sgMail.send as any).mockResolvedValue([{ statusCode: 202 }]);

    const result = await sendEmail(paymentOptions);

    expect(result).toBe(true);
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'noreply@predicts.com',
      templateId: expect.any(String),
      dynamicTemplateData: {
        amount: 100,
        packageName: 'Premium',
        paymentMethod: 'BANK_TRANSFER',
      },
    });
  });

  it('should send VIP activation email', async () => {
    const vipOptions = {
      to: 'test@example.com',
      template: 'vipActivated' as const,
      data: {
        packageName: 'Premium',
        features: ['feature1', 'feature2'],
        expiryDate: '2024-12-31',
      },
    };

    (sgMail.send as any).mockResolvedValue([{ statusCode: 202 }]);

    const result = await sendEmail(vipOptions);

    expect(result).toBe(true);
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'noreply@predicts.com',
      templateId: expect.any(String),
      dynamicTemplateData: {
        packageName: 'Premium',
        features: ['feature1', 'feature2'],
        expiryDate: '2024-12-31',
      },
    });
  });

  it('should handle email sending error', async () => {
    (sgMail.send as any).mockRejectedValue(new Error('Failed to send email'));

    const result = await sendEmail(mockEmailOptions);

    expect(result).toBe(false);
  });

  it('should validate required environment variables', async () => {
    delete process.env.SENDGRID_API_KEY;
    delete process.env.EMAIL_FROM;

    await expect(sendEmail(mockEmailOptions)).rejects.toThrow('Missing required environment variables');
  });
}); 