// =============================================================================
// BUILTIT AI - Environment Variable Handling
// All env vars are validated at startup. API keys are NEVER exposed to frontend.
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Server-Side Environment Schema (never sent to client)
// ---------------------------------------------------------------------------

const serverEnvSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  APP_SECRET: z.string().min(32).default('builtit-ai-secret-key-change-in-production-32chars'),

  // Database
  DATABASE_URL: z.string().default('file:./dev.db'),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32).default('nextauth-secret-key-change-in-production-32chars'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // AI Services (server-only — never exposed to frontend)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default('gpt-4o'),
  AI_VISION_MODEL: z.string().default('gpt-4o'),
  AI_SERVICE_MOCK: z.string().default('true'), // 'true' to use mock AI

  // File Storage
  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary', 'mock']).default('mock'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  LOCAL_UPLOAD_DIR: z.string().default('./public/uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(20),

  // Voice Service
  VOICE_PROVIDER: z.enum(['web-speech', 'elevenlabs', 'mock']).default('mock'),
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),

  // Video/Animation Service
  VIDEO_PROVIDER: z.enum(['ffmpeg', 'remotion', 'mock']).default('mock'),

  // Export Service
  EXPORT_DIR: z.string().default('./public/exports'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),

  // Rate Limiting
  RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

// ---------------------------------------------------------------------------
// Client-Side Environment Schema (safe to expose)
// ---------------------------------------------------------------------------

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('BUILTIT AI'),
  NEXT_PUBLIC_APP_TAGLINE: z.string().default('Upload. Analyze. Build.'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().default('false'),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_AI_DISCLAIMER: z
    .string()
    .default(
      'AI-derived logical construction sequence — not the actual historical drawing order from the original image.'
    ),
});

// ---------------------------------------------------------------------------
// Parsed env objects
// ---------------------------------------------------------------------------

let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;
let _clientEnv: z.infer<typeof clientEnvSchema> | null = null;

export function getServerEnv(): z.infer<typeof serverEnvSchema> {
  if (_serverEnv) return _serverEnv;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:', parsed.error.flatten().fieldErrors);
    // In dev, use defaults; in prod, throw
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid server environment configuration.');
    }
  }
  _serverEnv = parsed.data ?? serverEnvSchema.parse({});
  return _serverEnv;
}

export function getClientEnv(): z.infer<typeof clientEnvSchema> {
  if (_clientEnv) return _clientEnv;

  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_AI_DISCLAIMER: process.env.NEXT_PUBLIC_AI_DISCLAIMER,
  });

  if (!parsed.success) {
    console.warn('⚠️ Some client env vars missing — using defaults.');
  }

  _clientEnv = parsed.data ?? clientEnvSchema.parse({});
  return _clientEnv;
}

// Convenience exports
export const env = {
  get server() {
    return getServerEnv();
  },
  get client() {
    return getClientEnv();
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
  get isMockAI() {
    return process.env.AI_SERVICE_MOCK !== 'false';
  },
};
