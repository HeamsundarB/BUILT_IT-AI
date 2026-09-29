// POST /api/analyze - Analyze an uploaded image
import { NextRequest } from 'next/server';
import { getAIService } from '@/services/ai/aiService';
import { getDatabase } from '@/services/database/database';
import { successResponse, withErrorHandler, createError } from '@/lib/errors';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  if (!userId) throw createError.unauthorized();

  const body = await req.json();
  const { imageId, projectId } = body;

  if (!imageId || !projectId) {
    throw createError.badRequest('imageId and projectId are required');
  }

  const image = await getDatabase().findImageById(imageId);
  if (!image) throw createError.notFound('Image');

  const analysis = await getAIService().analyzeImage(image, projectId, userId);
  await getDatabase().saveAnalysis(analysis);

  return successResponse(analysis, 201);
});
