// =============================================================================
// BUILTIT AI - Video/Animation Service Interface + Mock
// =============================================================================

import { DiagramAnalysis } from '@/types';
import { logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface VideoJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  outputUrl?: string;
  progressPercent: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface VideoOptions {
  fps: number;
  durationMs: number;
  resolution: '720p' | '1080p' | '4k';
  showStepLabels: boolean;
  includeVoiceover: boolean;
  backgroundColor: string;
}

export interface IVideoService {
  createConstructionAnimation(
    analysis: DiagramAnalysis,
    options?: Partial<VideoOptions>
  ): Promise<VideoJob>;
  getJobStatus(jobId: string): Promise<VideoJob | null>;
  cancelJob(jobId: string): Promise<void>;
}

const videoJobs: Map<string, VideoJob> = new Map();

export class MockVideoService implements IVideoService {
  private log = logger.child('VideoService');

  async createConstructionAnimation(
    analysis: DiagramAnalysis,
    options?: Partial<VideoOptions>
  ): Promise<VideoJob> {
    this.log.info('MockVideo: Creating animation', {
      analysisId: analysis.id,
      steps: analysis.constructionSequence.length,
    });

    const defaultOpts: VideoOptions = {
      fps: 30,
      durationMs: analysis.constructionSequence.length * 2000,
      resolution: '1080p',
      showStepLabels: true,
      includeVoiceover: false,
      backgroundColor: '#0f0f1a',
      ...options,
    };

    const job: VideoJob = {
      id: uuidv4(),
      status: 'queued',
      progressPercent: 0,
      createdAt: new Date(),
    };

    videoJobs.set(job.id, job);

    // Simulate async video rendering
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      const j = videoJobs.get(job.id);
      if (!j) {
        clearInterval(interval);
        return;
      }
      j.progressPercent = Math.min(progress, 100);
      j.status = 'processing';
      if (progress >= 100) {
        j.status = 'completed';
        j.outputUrl = `/exports/animation_${job.id}.mp4`;
        j.completedAt = new Date();
        clearInterval(interval);
        this.log.info('MockVideo: Animation complete', { jobId: job.id });
      }
      videoJobs.set(job.id, j);
    }, 500);

    const _ = defaultOpts;
    return job;
  }

  async getJobStatus(jobId: string): Promise<VideoJob | null> {
    return videoJobs.get(jobId) ?? null;
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = videoJobs.get(jobId);
    if (job && job.status !== 'completed') {
      job.status = 'failed';
      job.error = 'Cancelled by user';
      videoJobs.set(jobId, job);
    }
  }
}

let _videoInstance: IVideoService | null = null;
export function getVideoService(): IVideoService {
  if (_videoInstance) return _videoInstance;
  _videoInstance = new MockVideoService();
  return _videoInstance;
}
