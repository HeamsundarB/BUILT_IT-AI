// =============================================================================
// BUILTIT AI - Core TypeScript Types
// =============================================================================

// ---------------------------------------------------------------------------
// Enums & Constants
// ---------------------------------------------------------------------------

export type DiagramType =
  | 'flowchart'
  | 'uml_class'
  | 'uml_sequence'
  | 'uml_use_case'
  | 'uml_activity'
  | 'uml_state'
  | 'er_diagram'
  | 'architecture'
  | 'network'
  | 'mind_map'
  | 'wireframe'
  | 'circuit'
  | 'unknown';

export type Confidence = 'high' | 'medium' | 'low' | 'uncertain';

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'json' | 'mermaid' | 'plantuml' | 'mp4';

export type AuthProvider = 'email' | 'google' | 'github';

export type ProjectStatus = 'active' | 'archived' | 'deleted';

export type PracticeMode = 'guided' | 'free' | 'timed' | 'challenge';

export type ConversationRole = 'user' | 'assistant' | 'system';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type VoiceLanguage = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE' | 'zh-CN' | 'ja-JP';

// ---------------------------------------------------------------------------
// User Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
  subscription: UserSubscription;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  voiceEnabled: boolean;
  voiceLanguage: VoiceLanguage;
  autoSave: boolean;
  defaultExportFormat: ExportFormat;
  notificationsEnabled: boolean;
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  expiresAt?: Date;
  uploadsUsed: number;
  uploadsLimit: number;
}

// ---------------------------------------------------------------------------
// Project Types
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  diagramType?: DiagramType;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  uploadedImages: UploadedImage[];
  analyses: DiagramAnalysis[];
  practiceSessions: PracticeSession[];
  exportJobs: ExportJob[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  diagramType?: DiagramType;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  imageCount: number;
  analysisCount: number;
}

// ---------------------------------------------------------------------------
// Uploaded Image Types
// ---------------------------------------------------------------------------

export interface UploadedImage {
  id: string;
  projectId: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  colorProfile?: string;
  dpi?: number;
  hasTransparency?: boolean;
  dominantColors?: string[];
  exif?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Diagram Analysis Types
// ---------------------------------------------------------------------------

export interface DiagramAnalysis {
  id: string;
  projectId: string;
  imageId: string;
  userId: string;
  status: LoadingState;
  diagramType: DiagramType;
  confidence: Confidence;
  confidenceScore: number; // 0-100
  elements: DiagramElement[];
  relationships: Relationship[];
  layers: Layer[];
  measurements: Measurement[];
  constructionSequence: ConstructionStep[];
  alternativeSequences: AlternativeSequence[];
  verificationResults: VerificationResult[];
  aiDisclaimer: string; // Always: "AI-derived logical construction sequence — not historical drawing order"
  analysedAt: Date;
  processingTimeMs: number;
  modelVersion: string;
  rawOutput?: Record<string, unknown>;
}

export interface DiagramElement {
  id: string;
  type: string;
  label?: string;
  description?: string;
  bounds?: Bounds;
  style?: ElementStyle;
  properties: Record<string, unknown>;
  confidence: Confidence;
  layer?: string;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  label?: string;
  description?: string;
  direction: 'unidirectional' | 'bidirectional' | 'none';
  style?: ElementStyle;
  properties: Record<string, unknown>;
  confidence: Confidence;
}

export interface Layer {
  id: string;
  name: string;
  description?: string;
  order: number;
  visible: boolean;
  elementIds: string[];
  color?: string;
}

export interface Measurement {
  id: string;
  elementId?: string;
  type: 'distance' | 'angle' | 'area' | 'count' | 'percentage';
  value: number;
  unit: string;
  label: string;
  description?: string;
  confidence: Confidence;
}

export interface ConstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  elementIds: string[];
  estimatedDuration?: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
  prerequisites: number[]; // step numbers that must come before
  tools?: string[];
  isOptional: boolean;
}

export interface AlternativeSequence {
  id: string;
  name: string;
  description: string;
  rationale: string;
  steps: ConstructionStep[];
  tradeoffs: string[];
  bestFor: string[];
}

export interface VerificationResult {
  id: string;
  checkName: string;
  passed: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  affectedElementIds: string[];
  suggestion?: string;
}

// ---------------------------------------------------------------------------
// Conversation & Chat Types
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string;
  projectId?: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  context?: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ConversationRole;
  content: string;
  attachments?: ChatAttachment[];
  metadata?: ChatMessageMetadata;
  createdAt: Date;
}

export interface ChatAttachment {
  type: 'image' | 'diagram' | 'file';
  url: string;
  name: string;
  mimeType: string;
}

export interface ChatMessageMetadata {
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  processingTimeMs?: number;
  isStreaming?: boolean;
  error?: string;
}

export interface ConversationContext {
  projectId?: string;
  imageId?: string;
  analysisId?: string;
  diagramType?: DiagramType;
  currentStep?: number;
  practiceSessionId?: string;
}

// ---------------------------------------------------------------------------
// Practice Session Types
// ---------------------------------------------------------------------------

export interface PracticeSession {
  id: string;
  projectId: string;
  userId: string;
  analysisId: string;
  mode: PracticeMode;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  score?: number;
  accuracy?: number;
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  timeSpentMs: number;
  steps: PracticeStepResult[];
  settings: PracticeSettings;
}

export interface PracticeStepResult {
  stepNumber: number;
  completed: boolean;
  correct?: boolean;
  attemptCount: number;
  timeSpentMs: number;
  hintsUsed: number;
  notes?: string;
}

export interface PracticeSettings {
  showHints: boolean;
  allowSkip: boolean;
  timeLimitSeconds?: number;
  voiceGuidance: boolean;
  showProgress: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
}

// ---------------------------------------------------------------------------
// Export Types
// ---------------------------------------------------------------------------

export interface ExportJob {
  id: string;
  projectId: string;
  userId: string;
  format: ExportFormat;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  options: ExportOptions;
  outputUrl?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  fileSizeBytes?: number;
}

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 1-100
  scale?: number;
  includeMetadata?: boolean;
  includeConstructionSteps?: boolean;
  includeAlternatives?: boolean;
  pageSize?: 'A4' | 'A3' | 'Letter' | 'custom';
  orientation?: 'portrait' | 'landscape';
  backgroundColor?: string;
  transparentBackground?: boolean;
  animationDuration?: number; // ms, for video exports
  fps?: number; // for video exports
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  requestId?: string;
}

export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
  processingTimeMs?: number;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Auth Types
// ---------------------------------------------------------------------------

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// UI State Types
// ---------------------------------------------------------------------------

export interface UIState {
  sidebar: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Workspace Types
// ---------------------------------------------------------------------------

export interface WorkspaceState {
  project: Project | null;
  activeImage: UploadedImage | null;
  activeAnalysis: DiagramAnalysis | null;
  activeTab: 'analysis' | 'construction' | 'practice' | 'export' | 'chat';
  zoom: number;
  panX: number;
  panY: number;
  selectedElementIds: string[];
  visibleLayers: string[];
  showGrid: boolean;
  showMeasurements: boolean;
}

// ---------------------------------------------------------------------------
// Service Interface Types (for dependency injection)
// ---------------------------------------------------------------------------

export interface ServiceConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
  mock?: boolean;
}

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs?: number;
  version?: string;
  error?: string;
  checkedAt: Date;
}
