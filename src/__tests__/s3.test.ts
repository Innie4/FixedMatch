import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { uploadToS3 } from '@/lib/s3';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

describe('S3 Upload', () => {
  const mockFileBuffer = new ArrayBuffer(8);
  const mockS3Client = {
    send: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.AWS_S3_BUCKET = 'test-bucket';
    (S3Client as any).mockImplementation(() => mockS3Client);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should upload file to S3', async () => {
    const mockUrl = 'https://test-bucket.s3.amazonaws.com/test.jpg';
    (mockS3Client.send as any).mockResolvedValue({});

    const result = await uploadToS3(mockFileBuffer, 'test.jpg', 'image/jpeg');

    expect(result).toBe(mockUrl);
    expect(S3Client).toHaveBeenCalledWith({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'test.jpg',
      Body: mockFileBuffer,
      ContentType: 'image/jpeg',
    });
  });

  it('should handle upload error', async () => {
    (mockS3Client.send as any).mockRejectedValue(new Error('Upload failed'));

    await expect(uploadToS3(mockFileBuffer, 'test.jpg', 'image/jpeg')).rejects.toThrow('Upload failed');
  });

  it('should validate required environment variables', async () => {
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_S3_BUCKET;

    await expect(uploadToS3(mockFileBuffer, 'test.jpg', 'image/jpeg')).rejects.toThrow('Missing required environment variables');
  });

  it('should handle invalid file', async () => {
    await expect(uploadToS3(null as any, 'test.jpg', 'image/jpeg')).rejects.toThrow('Invalid file');
    await expect(uploadToS3(undefined as any, 'test.jpg', 'image/jpeg')).rejects.toThrow('Invalid file');
  });

  it('should handle invalid filename', async () => {
    await expect(uploadToS3(mockFileBuffer, '', 'image/jpeg')).rejects.toThrow('Invalid filename');
    await expect(uploadToS3(mockFileBuffer, null as any, 'image/jpeg')).rejects.toThrow('Invalid filename');
  });

  it('should generate unique filenames', async () => {
    const mockUrl = 'https://test-bucket.s3.amazonaws.com/test.jpg';
    (mockS3Client.send as any).mockResolvedValue({});

    const result1 = await uploadToS3(mockFileBuffer, 'test.jpg', 'image/jpeg');
    const result2 = await uploadToS3(mockFileBuffer, 'test.jpg', 'image/jpeg');

    expect(result1).not.toBe(result2);
    expect(result1).toMatch(/^https:\/\/test-bucket\.s3\.amazonaws\.com\/test-\d+\.jpg$/);
    expect(result2).toMatch(/^https:\/\/test-bucket\.s3\.amazonaws\.com\/test-\d+\.jpg$/);
  });

  it('should handle different file types', async () => {
    const mockUrl = 'https://test-bucket.s3.amazonaws.com/test.png';
    (mockS3Client.send as any).mockResolvedValue({});

    const pngFileBuffer = new ArrayBuffer(8);
    const result = await uploadToS3(pngFileBuffer, 'test.png', 'image/png');

    expect(result).toBe(mockUrl);
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'test.png',
      Body: pngFileBuffer,
      ContentType: 'image/png',
    });
  });
}); 