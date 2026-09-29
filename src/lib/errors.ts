// =============================================================================
// BUILTIT AI - Centralized Error Handling
// =============================================================================

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError, ApiResponse } from '@/types';
import { logger } from './logger';

// ---------------------------------------------------------------------------
// Error Codes
// ---------------------------------------------------------------------------

export const ErrorCodes = {
  // Generic
  UNKNOWN: 'UNKNOWN_ERROR',
  INTERNAL: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  TIMEOUT: 'TIMEOUT',

  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_EMAIL_EXISTS: 'AUTH_EMAIL_EXISTS',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  // Upload
  UPLOAD_FILE_TOO_LARGE: 'UPLOAD_FILE_TOO_LARGE',
  UPLOAD_INVALID_TYPE: 'UPLOAD_INVALID_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  UPLOAD_QUOTA_EXCEEDED: 'UPLOAD_QUOTA_EXCEEDED',

  // Analysis
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  ANALYSIS_IN_PROGRESS: 'ANALYSIS_IN_PROGRESS',
  ANALYSIS_UNSUPPORTED_TYPE: 'ANALYSIS_UNSUPPORTED_TYPE',

  // Project
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  PROJECT_ACCESS_DENIED: 'PROJECT_ACCESS_DENIED',
  PROJECT_LIMIT_REACHED: 'PROJECT_LIMIT_REACHED',

  // AI Service
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_QUOTA_EXCEEDED: 'AI_QUOTA_EXCEEDED',
  AI_CONTENT_FILTERED: 'AI_CONTENT_FILTERED',

  // Export
  EXPORT_FAILED: 'EXPORT_FAILED',
  EXPORT_FORMAT_UNSUPPORTED: 'EXPORT_FORMAT_UNSUPPORTED',

  // Storage
  STORAGE_UNAVAILABLE: 'STORAGE_UNAVAILABLE',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ---------------------------------------------------------------------------
// AppError Class
// ---------------------------------------------------------------------------

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = ErrorCodes.INTERNAL,
    statusCode = 500,
    details?: Record<string, unknown>,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date(),
    };
  }
}

// ---------------------------------------------------------------------------
// Typed Error Factories
// ---------------------------------------------------------------------------

export const createError = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new AppError(message, ErrorCodes.BAD_REQUEST, 400, details),

  unauthorized: (message = 'Authentication required') =>
    new AppError(message, ErrorCodes.UNAUTHORIZED, 401),

  forbidden: (message = 'Access denied') =>
    new AppError(message, ErrorCodes.FORBIDDEN, 403),

  notFound: (resource: string) =>
    new AppError(`${resource} not found`, ErrorCodes.NOT_FOUND, 404),

  validation: (message: string, details?: Record<string, unknown>) =>
    new AppError(message, ErrorCodes.VALIDATION, 422, details),

  internal: (message = 'An internal server error occurred') =>
    new AppError(message, ErrorCodes.INTERNAL, 500, undefined, false),

  rateLimited: () =>
    new AppError('Too many requests — please slow down', ErrorCodes.RATE_LIMITED, 429),

  aiUnavailable: () =>
    new AppError('AI service temporarily unavailable', ErrorCodes.AI_SERVICE_UNAVAILABLE, 503),

  uploadTooLarge: (maxMb: number) =>
    new AppError(`File exceeds ${maxMb}MB limit`, ErrorCodes.UPLOAD_FILE_TOO_LARGE, 413),

  invalidFileType: (allowed: string[]) =>
    new AppError(
      `Invalid file type. Allowed: ${allowed.join(', ')}`,
      ErrorCodes.UPLOAD_INVALID_TYPE,
      415
    ),
};

// ---------------------------------------------------------------------------
// API Response Helpers
// ---------------------------------------------------------------------------

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  error: unknown,
  requestId?: string
): NextResponse<ApiResponse<never>> {
  if (error instanceof AppError) {
    logger.warn('AppError', { code: error.code, message: error.message, details: error.details });
    const apiError = error.toApiError();
    if (requestId) apiError.requestId = requestId;
    return NextResponse.json({ success: false, error: apiError }, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    const details = Object.fromEntries(
      Object.entries(error.flatten().fieldErrors).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v ?? '')])
    );
    logger.warn('ValidationError', { details });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION,
          message: 'Validation failed',
          details,
          timestamp: new Date(),
          requestId,
        } satisfies ApiError,
      },
      { status: 422 }
    );
  }

  // Unknown error — log full detail, return generic message
  logger.error('UnhandledError', { error });
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL,
        message: 'An unexpected error occurred',
        timestamp: new Date(),
        requestId,
      } satisfies ApiError,
    },
    { status: 500 }
  );
}

// ---------------------------------------------------------------------------
// Route Handler Wrapper
// ---------------------------------------------------------------------------

import { NextRequest } from 'next/server';

type RouteHandler = (req: NextRequest, context?: unknown) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: unknown) => {
    const requestId = crypto.randomUUID();
    try {
      return await handler(req, context);
    } catch (err) {
      return errorResponse(err, requestId);
    }
  };
}

// ---------------------------------------------------------------------------
// Client-Side Error Helpers
// ---------------------------------------------------------------------------

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof AppError && error.statusCode === 404;
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AppError && error.statusCode === 401;
}
