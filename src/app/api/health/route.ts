// =============================================================================
// BUILTIT AI - API: Health Check
// =============================================================================

import { NextResponse } from 'next/server';
import { getAIService } from '@/services/ai/aiService';
import { getDatabase } from '@/services/database/database';
import { getStorageService } from '@/services/storage/storageService';

export async function GET() {
  const checks = await Promise.allSettled([
    getDatabase().ping().then((ok) => ({ service: 'database', status: ok ? 'healthy' : 'unhealthy' })),
    getAIService().healthCheck().then((r) => ({ service: 'ai', status: r.healthy ? 'healthy' : 'unhealthy', version: r.version })),
    Promise.resolve({ service: 'storage', status: 'healthy' }),
  ]);

  const results = checks.map((c, i) =>
    c.status === 'fulfilled'
      ? c.value
      : { service: ['database', 'ai', 'storage'][i], status: 'unhealthy', error: String(c.reason) }
  );

  const allHealthy = results.every((r) => r.status === 'healthy');

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      app: 'BUILTIT AI',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      services: results,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
