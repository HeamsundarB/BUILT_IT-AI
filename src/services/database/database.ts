// =============================================================================
// BUILTIT AI - Database Service Interface + In-Memory Mock
// =============================================================================

import {
  User,
  Project,
  ProjectSummary,
  UploadedImage,
  DiagramAnalysis,
  Conversation,
  ChatMessage,
  PracticeSession,
  ExportJob,
} from '@/types';
import { dbLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IDatabase {
  // Users
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Projects
  findProjectById(id: string): Promise<Project | null>;
  listProjects(userId: string, options?: { page?: number; pageSize?: number }): Promise<{ items: ProjectSummary[]; total: number }>;
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' | 'uploadedImages' | 'analyses' | 'practiceSessions' | 'exportJobs'>): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Images
  findImageById(id: string): Promise<UploadedImage | null>;
  saveImage(image: UploadedImage): Promise<UploadedImage>;
  deleteImage(id: string): Promise<void>;

  // Analyses
  findAnalysisById(id: string): Promise<DiagramAnalysis | null>;
  saveAnalysis(analysis: DiagramAnalysis): Promise<DiagramAnalysis>;
  listAnalysesByProject(projectId: string): Promise<DiagramAnalysis[]>;

  // Conversations
  findConversationById(id: string): Promise<Conversation | null>;
  listConversationsByUser(userId: string): Promise<Conversation[]>;
  createConversation(data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation>;
  addMessage(conversationId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage>;

  // Practice Sessions
  findPracticeSessionById(id: string): Promise<PracticeSession | null>;
  savePracticeSession(session: PracticeSession): Promise<PracticeSession>;
  listPracticeSessionsByProject(projectId: string): Promise<PracticeSession[]>;

  // Export Jobs
  findExportJobById(id: string): Promise<ExportJob | null>;
  saveExportJob(job: ExportJob): Promise<ExportJob>;

  // Health
  ping(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// In-Memory Mock Database
// ---------------------------------------------------------------------------

export class MockDatabase implements IDatabase {
  private users = new Map<string, User>();
  private projects = new Map<string, Project>();
  private images = new Map<string, UploadedImage>();
  private analyses = new Map<string, DiagramAnalysis>();
  private conversations = new Map<string, Conversation>();
  private practiceSessions = new Map<string, PracticeSession>();
  private exportJobs = new Map<string, ExportJob>();

  // Users
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find((u) => u.email === email) ?? null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = { ...data, id: uuidv4(), createdAt: new Date(), updatedAt: new Date() };
    this.users.set(user.id, user);
    dbLogger.debug('Created user', { id: user.id });
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error(`User ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Projects
  async findProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) ?? null;
  }

  async listProjects(userId: string, opts = { page: 1, pageSize: 20 }): Promise<{ items: ProjectSummary[]; total: number }> {
    const all = Array.from(this.projects.values())
      .filter((p) => p.userId === userId && p.status !== 'deleted')
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const total = all.length;
    const start = ((opts.page ?? 1) - 1) * (opts.pageSize ?? 20);
    const items = all.slice(start, start + (opts.pageSize ?? 20)).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      diagramType: p.diagramType,
      thumbnailUrl: p.thumbnailUrl,
      tags: p.tags,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      imageCount: p.uploadedImages.length,
      analysisCount: p.analyses.length,
    }));

    return { items, total };
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' | 'uploadedImages' | 'analyses' | 'practiceSessions' | 'exportJobs'>): Promise<Project> {
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      uploadedImages: [],
      analyses: [],
      practiceSessions: [],
      exportJobs: [],
    };
    this.projects.set(project.id, project);
    dbLogger.debug('Created project', { id: project.id, name: project.name });
    return project;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error(`Project ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    const p = this.projects.get(id);
    if (p) {
      p.status = 'deleted';
      this.projects.set(id, p);
    }
  }

  // Images
  async findImageById(id: string): Promise<UploadedImage | null> {
    return this.images.get(id) ?? null;
  }

  async saveImage(image: UploadedImage): Promise<UploadedImage> {
    this.images.set(image.id, image);
    const project = this.projects.get(image.projectId);
    if (project && !project.uploadedImages.find((i) => i.id === image.id)) {
      project.uploadedImages.push(image);
      this.projects.set(project.id, project);
    }
    return image;
  }

  async deleteImage(id: string): Promise<void> {
    this.images.delete(id);
  }

  // Analyses
  async findAnalysisById(id: string): Promise<DiagramAnalysis | null> {
    return this.analyses.get(id) ?? null;
  }

  async saveAnalysis(analysis: DiagramAnalysis): Promise<DiagramAnalysis> {
    this.analyses.set(analysis.id, analysis);
    const project = this.projects.get(analysis.projectId);
    if (project && !project.analyses.find((a) => a.id === analysis.id)) {
      project.analyses.push(analysis);
      this.projects.set(project.id, project);
    }
    return analysis;
  }

  async listAnalysesByProject(projectId: string): Promise<DiagramAnalysis[]> {
    return Array.from(this.analyses.values()).filter((a) => a.projectId === projectId);
  }

  // Conversations
  async findConversationById(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) ?? null;
  }

  async listConversationsByUser(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter((c) => c.userId === userId);
  }

  async createConversation(data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const conv: Conversation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  async addMessage(conversationId: string, msgData: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const conv = this.conversations.get(conversationId);
    if (!conv) throw new Error(`Conversation ${conversationId} not found`);
    const message: ChatMessage = { ...msgData, id: uuidv4(), createdAt: new Date() };
    conv.messages.push(message);
    conv.updatedAt = new Date();
    this.conversations.set(conversationId, conv);
    return message;
  }

  // Practice Sessions
  async findPracticeSessionById(id: string): Promise<PracticeSession | null> {
    return this.practiceSessions.get(id) ?? null;
  }

  async savePracticeSession(session: PracticeSession): Promise<PracticeSession> {
    this.practiceSessions.set(session.id, session);
    return session;
  }

  async listPracticeSessionsByProject(projectId: string): Promise<PracticeSession[]> {
    return Array.from(this.practiceSessions.values()).filter((s) => s.projectId === projectId);
  }

  // Export Jobs
  async findExportJobById(id: string): Promise<ExportJob | null> {
    return this.exportJobs.get(id) ?? null;
  }

  async saveExportJob(job: ExportJob): Promise<ExportJob> {
    this.exportJobs.set(job.id, job);
    return job;
  }

  // Health
  async ping(): Promise<boolean> {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _dbInstance: IDatabase | null = null;
export function getDatabase(): IDatabase {
  if (_dbInstance) return _dbInstance;
  _dbInstance = new MockDatabase();
  dbLogger.info('MockDatabase initialized');
  return _dbInstance;
}
