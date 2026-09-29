// =============================================================================
// BUILTIT AI - Export Service Interface + Mock
// =============================================================================

import { ExportJob, ExportOptions, ExportFormat, DiagramAnalysis } from '@/types';
import { exportLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface IExportService {
  createJob(
    projectId: string,
    userId: string,
    analysis: DiagramAnalysis,
    options: ExportOptions
  ): Promise<ExportJob>;
  getJob(jobId: string): Promise<ExportJob | null>;
  listJobs(userId: string): Promise<ExportJob[]>;
  cancelJob(jobId: string): Promise<void>;
}

const mockJobs: Map<string, ExportJob> = new Map();

export class MockExportService implements IExportService {
  async createJob(
    projectId: string,
    userId: string,
    analysis: DiagramAnalysis,
    options: ExportOptions
  ): Promise<ExportJob> {
    exportLogger.info('MockExport: Creating job', { projectId, format: options.format });

    const job: ExportJob = {
      id: uuidv4(),
      projectId,
      userId,
      format: options.format,
      status: 'queued',
      options,
      createdAt: new Date(),
    };

    mockJobs.set(job.id, job);

    // Simulate async processing
    setTimeout(async () => {
      const j = mockJobs.get(job.id);
      if (!j) return;
      j.status = 'processing';
      j.startedAt = new Date();
      mockJobs.set(job.id, j);

      await new Promise((r) => setTimeout(r, 2000));

      j.status = 'completed';
      j.completedAt = new Date();
      j.outputUrl = `/exports/${job.id}.${options.format}`;
      j.fileSizeBytes = 1024 * 512; // 512KB mock
      mockJobs.set(job.id, j);
      exportLogger.info('MockExport: Job complete', { jobId: job.id });
    }, 100);

    const _ = analysis; // Used for real export
    return job;
  }

  async getJob(jobId: string): Promise<ExportJob | null> {
    return mockJobs.get(jobId) ?? null;
  }

  async listJobs(userId: string): Promise<ExportJob[]> {
    return Array.from(mockJobs.values()).filter((j) => j.userId === userId);
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = mockJobs.get(jobId);
    if (job && job.status === 'queued') {
      job.status = 'failed';
      job.error = 'Cancelled by user';
      mockJobs.set(jobId, job);
    }
  }
}

let _exportInstance: IExportService | null = null;
export function getExportService(): IExportService {
  if (_exportInstance) return _exportInstance;
  _exportInstance = new MockExportService();
  return _exportInstance;
}
