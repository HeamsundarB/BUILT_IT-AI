// =============================================================================
// BUILTIT AI - Storage Service Interface + Mock Implementation
// =============================================================================

import { UploadedImage, ImageMetadata } from '@/types';
import { uploadLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface IStorageService {
  uploadImage(
    file: Buffer | Blob,
    filename: string,
    mimeType: string,
    projectId: string,
    userId: string
  ): Promise<UploadedImage>;
  deleteImage(imageId: string): Promise<void>;
  getImageUrl(imageId: string): Promise<string | null>;
  listImages(projectId: string): Promise<UploadedImage[]>;
}

// In-memory store for mock
const mockImages: Map<string, UploadedImage> = new Map();

export class MockStorageService implements IStorageService {
  async uploadImage(
    file: Buffer | Blob,
    filename: string,
    mimeType: string,
    projectId: string,
    userId: string
  ): Promise<UploadedImage> {
    uploadLogger.info('MockStorage: Uploading image', { filename, projectId });
    await new Promise((r) => setTimeout(r, 300));

    const id = uuidv4();
    const ext = filename.split('.').pop() || 'png';
    const storedFilename = `${id}.${ext}`;

    const sizeBytes =
      file instanceof Buffer ? file.length : typeof file === 'object' ? (file as Blob).size : 1024;

    const metadata: ImageMetadata = {
      colorProfile: 'sRGB',
      dpi: 96,
      hasTransparency: mimeType === 'image/png' || mimeType === 'image/webp',
      dominantColors: ['#6366f1', '#8b5cf6', '#a78bfa'],
    };

    const image: UploadedImage = {
      id,
      projectId,
      userId,
      filename: storedFilename,
      originalName: filename,
      mimeType,
      sizeBytes,
      url: `/uploads/${storedFilename}`,
      thumbnailUrl: `/uploads/thumb_${storedFilename}`,
      width: 1920,
      height: 1080,
      uploadedAt: new Date(),
      metadata,
    };

    mockImages.set(id, image);
    uploadLogger.info('MockStorage: Upload complete', { imageId: id });
    return image;
  }

  async deleteImage(imageId: string): Promise<void> {
    uploadLogger.info('MockStorage: Deleting image', { imageId });
    mockImages.delete(imageId);
  }

  async getImageUrl(imageId: string): Promise<string | null> {
    return mockImages.get(imageId)?.url ?? null;
  }

  async listImages(projectId: string): Promise<UploadedImage[]> {
    return Array.from(mockImages.values()).filter((img) => img.projectId === projectId);
  }
}

let _storageInstance: IStorageService | null = null;
export function getStorageService(): IStorageService {
  if (_storageInstance) return _storageInstance;
  _storageInstance = new MockStorageService();
  return _storageInstance;
}
