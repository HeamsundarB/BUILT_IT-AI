// =============================================================================
// BUILTIT AI - Centralized Validation (Zod v4 compatible)
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Auth Schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ---------------------------------------------------------------------------
// Project Schemas
// ---------------------------------------------------------------------------

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags').default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

// ---------------------------------------------------------------------------
// Upload Schemas
// ---------------------------------------------------------------------------

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
] as const;

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const uploadSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  filename: z.string().min(1),
  mimeType: z.string().refine(
    (v) => ALLOWED_IMAGE_TYPES.includes(v as typeof ALLOWED_IMAGE_TYPES[number]),
    { message: `Supported formats: ${ALLOWED_IMAGE_TYPES.join(', ')}` }
  ),
  sizeBytes: z.number().max(MAX_FILE_SIZE_BYTES, 'File exceeds 20MB limit'),
});

// ---------------------------------------------------------------------------
// Practice Session Schemas
// ---------------------------------------------------------------------------

export const createPracticeSessionSchema = z.object({
  projectId: z.string().uuid(),
  analysisId: z.string().uuid(),
  mode: z.enum(['guided', 'free', 'timed', 'challenge']),
  settings: z
    .object({
      showHints: z.boolean().default(true),
      allowSkip: z.boolean().default(true),
      timeLimitSeconds: z.number().positive().optional(),
      voiceGuidance: z.boolean().default(false),
      showProgress: z.boolean().default(true),
      difficulty: z.enum(['easy', 'medium', 'hard', 'adaptive']).default('adaptive'),
    })
    .optional(),
});

// ---------------------------------------------------------------------------
// Export Schemas
// ---------------------------------------------------------------------------

export const exportJobSchema = z.object({
  projectId: z.string().uuid(),
  analysisId: z.string().uuid().optional(),
  format: z.enum(['png', 'svg', 'pdf', 'json', 'mermaid', 'plantuml', 'mp4']),
  options: z
    .object({
      quality: z.number().min(1).max(100).default(90),
      scale: z.number().min(0.1).max(4).default(1),
      includeMetadata: z.boolean().default(false),
      includeConstructionSteps: z.boolean().default(false),
      includeAlternatives: z.boolean().default(false),
      transparentBackground: z.boolean().default(false),
    })
    .optional(),
});

// ---------------------------------------------------------------------------
// Chat Schemas
// ---------------------------------------------------------------------------

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  content: z.string().min(1, 'Message cannot be empty').max(4000, 'Message too long'),
});

// ---------------------------------------------------------------------------
// Settings Schemas
// ---------------------------------------------------------------------------

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  voiceEnabled: z.boolean().optional(),
  voiceLanguage: z
    .enum(['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP'])
    .optional(),
  autoSave: z.boolean().optional(),
  defaultExportFormat: z
    .enum(['png', 'svg', 'pdf', 'json', 'mermaid', 'plantuml', 'mp4'])
    .optional(),
  notificationsEnabled: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Pagination Schema
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().max(200).optional(),
});

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
export type CreatePracticeSessionInput = z.infer<typeof createPracticeSessionSchema>;
export type ExportJobInput = z.infer<typeof exportJobSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// ---------------------------------------------------------------------------
// Validation Helpers
// ---------------------------------------------------------------------------

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string[]> = {};
  const fieldErrors = result.error.flatten().fieldErrors;
  for (const [k, v] of Object.entries(fieldErrors)) {
    errors[k] = Array.isArray(v) ? v : [String(v ?? '')];
  }
  return { success: false, errors };
}
