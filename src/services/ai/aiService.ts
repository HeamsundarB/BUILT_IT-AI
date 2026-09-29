// =============================================================================
// BUILTIT AI - AI Service Interface + Mock Implementation
// IMPORTANT: Real AI models connect here without touching other code.
// DISCLAIMER: AI derives a logical construction sequence — NOT the historical
// drawing order from the original image.
// =============================================================================

import {
  DiagramAnalysis,
  DiagramType,
  DiagramElement,
  Relationship,
  Layer,
  Measurement,
  ConstructionStep,
  AlternativeSequence,
  VerificationResult,
  Confidence,
  ChatMessage,
  ConversationContext,
  UploadedImage,
} from '@/types';
import { aiLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// AI Service Interface
// ---------------------------------------------------------------------------

export interface IAIService {
  /** Analyze an uploaded diagram image */
  analyzeImage(image: UploadedImage, projectId: string, userId: string): Promise<DiagramAnalysis>;

  /** Generate a chat response given a message and optional context */
  chat(
    messages: Pick<ChatMessage, 'role' | 'content'>[],
    context?: ConversationContext
  ): Promise<string>;

  /** Detect the type of diagram from an image URL */
  detectDiagramType(imageUrl: string): Promise<{ type: DiagramType; confidence: Confidence; score: number }>;

  /** Check service health */
  healthCheck(): Promise<{ healthy: boolean; version: string; latencyMs: number }>;
}

// ---------------------------------------------------------------------------
// AI Disclaimer (always included in analyses)
// ---------------------------------------------------------------------------

export const AI_DISCLAIMER =
  'This construction sequence is AI-derived based on logical analysis of the diagram structure. ' +
  'It does NOT represent the actual historical drawing order from the original image. ' +
  'BUILTIT AI generates a plausible logical construction sequence to support learning and practice.';

// ---------------------------------------------------------------------------
// Mock AI Service (production-safe interface — swap for real AI later)
// ---------------------------------------------------------------------------

export class MockAIService implements IAIService {
  private readonly delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async analyzeImage(
    image: UploadedImage,
    projectId: string,
    userId: string
  ): Promise<DiagramAnalysis> {
    aiLogger.info('MockAI: Analyzing image', { imageId: image.id, projectId });
    await this.delay(1500); // Simulate processing time

    const diagramType = this.randomDiagramType();
    const elements = this.generateMockElements(diagramType);
    const relationships = this.generateMockRelationships(elements);
    const layers = this.generateMockLayers(elements);
    const steps = this.generateMockConstructionSteps(elements);

    return {
      id: uuidv4(),
      projectId,
      imageId: image.id,
      userId,
      status: 'success',
      diagramType,
      confidence: 'medium',
      confidenceScore: 72,
      elements,
      relationships,
      layers,
      measurements: this.generateMockMeasurements(elements),
      constructionSequence: steps,
      alternativeSequences: this.generateMockAlternatives(steps),
      verificationResults: this.generateMockVerifications(elements, relationships),
      aiDisclaimer: AI_DISCLAIMER,
      analysedAt: new Date(),
      processingTimeMs: 1500,
      modelVersion: 'mock-v1.0',
    };
  }

  async chat(
    messages: Pick<ChatMessage, 'role' | 'content'>[],
    context?: ConversationContext
  ): Promise<string> {
    aiLogger.debug('MockAI: Chat request', { messageCount: messages.length, context });
    await this.delay(800);

    const lastMsg = messages[messages.length - 1];
    const responses = [
      `I've analyzed your diagram and can help you understand the construction sequence. ${context?.diagramType ? `This appears to be a ${context.diagramType} diagram.` : ''}`,
      `Great question! In this diagram, the elements are logically organized into layers that suggest a specific construction approach.`,
      `Based on my AI analysis, I recommend starting with the foundational elements before adding the connecting relationships. Remember — this is an AI-derived logical sequence, not the actual drawing order used originally.`,
      `I can break down this diagram step by step. Would you like to start the practice session to try reconstructing it yourself?`,
      `The diagram has ${context?.analysisId ? 'been analyzed' : 'not yet been fully analyzed'}. Upload your diagram image to begin the analysis.`,
    ];

    const _ = lastMsg; // Mark as used
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async detectDiagramType(
    imageUrl: string
  ): Promise<{ type: DiagramType; confidence: Confidence; score: number }> {
    aiLogger.debug('MockAI: Detecting diagram type', { imageUrl });
    await this.delay(500);
    const _ = imageUrl;
    return { type: this.randomDiagramType(), confidence: 'medium', score: 68 };
  }

  async healthCheck(): Promise<{ healthy: boolean; version: string; latencyMs: number }> {
    const start = Date.now();
    await this.delay(10);
    return { healthy: true, version: 'mock-v1.0', latencyMs: Date.now() - start };
  }

  // -------------------------------------------------------------------------
  // Private Helpers
  // -------------------------------------------------------------------------

  private randomDiagramType(): DiagramType {
    const types: DiagramType[] = ['flowchart', 'uml_class', 'uml_sequence', 'er_diagram', 'architecture', 'mind_map'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private generateMockElements(type: DiagramType): DiagramElement[] {
    const elementTemplates: Record<string, Partial<DiagramElement>[]> = {
      flowchart: [
        { type: 'start', label: 'Start', description: 'Process entry point' },
        { type: 'process', label: 'Initialize System', description: 'Set up initial state' },
        { type: 'decision', label: 'Input Valid?', description: 'Validate user input' },
        { type: 'process', label: 'Process Data', description: 'Core business logic' },
        { type: 'process', label: 'Handle Error', description: 'Error recovery path' },
        { type: 'end', label: 'End', description: 'Process exit point' },
      ],
      uml_class: [
        { type: 'class', label: 'User', description: 'User entity class' },
        { type: 'class', label: 'Project', description: 'Project entity class' },
        { type: 'class', label: 'Analysis', description: 'Analysis entity class' },
        { type: 'interface', label: 'IRepository', description: 'Data access interface' },
      ],
      er_diagram: [
        { type: 'entity', label: 'User', description: 'System user' },
        { type: 'entity', label: 'Project', description: 'User project' },
        { type: 'entity', label: 'Image', description: 'Uploaded image' },
        { type: 'relationship', label: 'owns', description: 'Ownership relation' },
        { type: 'relationship', label: 'contains', description: 'Containment relation' },
      ],
    };

    const templates = elementTemplates[type] || elementTemplates.flowchart;
    return templates.map((t, i) => ({
      id: uuidv4(),
      type: t.type!,
      label: t.label,
      description: t.description,
      bounds: { x: 100 + (i % 3) * 200, y: 100 + Math.floor(i / 3) * 150, width: 160, height: 60 },
      properties: {},
      confidence: 'medium' as Confidence,
    }));
  }

  private generateMockRelationships(elements: DiagramElement[]): Relationship[] {
    if (elements.length < 2) return [];
    return elements.slice(0, -1).map((el, i) => ({
      id: uuidv4(),
      sourceId: el.id,
      targetId: elements[i + 1].id,
      type: 'association',
      direction: 'unidirectional' as const,
      properties: {},
      confidence: 'medium' as Confidence,
    }));
  }

  private generateMockLayers(elements: DiagramElement[]): Layer[] {
    return [
      {
        id: uuidv4(),
        name: 'Foundation',
        description: 'Core structural elements',
        order: 1,
        visible: true,
        elementIds: elements.slice(0, 2).map((e) => e.id),
        color: '#6366f1',
      },
      {
        id: uuidv4(),
        name: 'Logic',
        description: 'Processing and decision elements',
        order: 2,
        visible: true,
        elementIds: elements.slice(2, 4).map((e) => e.id),
        color: '#8b5cf6',
      },
      {
        id: uuidv4(),
        name: 'Terminal',
        description: 'Entry and exit points',
        order: 3,
        visible: true,
        elementIds: elements.slice(4).map((e) => e.id),
        color: '#a78bfa',
      },
    ];
  }

  private generateMockMeasurements(elements: DiagramElement[]): Measurement[] {
    return [
      {
        id: uuidv4(),
        type: 'count',
        value: elements.length,
        unit: 'elements',
        label: 'Total Elements',
        description: 'Number of diagram elements identified',
        confidence: 'high',
      },
      {
        id: uuidv4(),
        type: 'percentage',
        value: 72,
        unit: '%',
        label: 'Analysis Confidence',
        description: 'Overall confidence in diagram analysis',
        confidence: 'medium',
      },
    ];
  }

  private generateMockConstructionSteps(elements: DiagramElement[]): ConstructionStep[] {
    return elements.map((el, i) => ({
      stepNumber: i + 1,
      title: `Draw ${el.label || el.type}`,
      description: `AI-suggested step: Add the ${el.type} element "${el.label || 'unnamed'}". ${el.description || ''}`,
      elementIds: [el.id],
      estimatedDuration: 30 + Math.floor(Math.random() * 60),
      difficulty: (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)],
      prerequisites: i > 0 ? [i] : [],
      tools: ['pen', 'ruler'],
      isOptional: i > elements.length - 2,
    }));
  }

  private generateMockAlternatives(baseSteps: ConstructionStep[]): AlternativeSequence[] {
    return [
      {
        id: uuidv4(),
        name: 'Top-Down Approach',
        description: 'Begin with high-level structure, refine details later',
        rationale: 'Good for understanding overall architecture before details',
        steps: baseSteps.slice().reverse(),
        tradeoffs: ['Requires more planning upfront', 'Easier to adjust layout'],
        bestFor: ['Large diagrams', 'Teaching purposes', 'Architecture reviews'],
      },
    ];
  }

  private generateMockVerifications(
    elements: DiagramElement[],
    relationships: Relationship[]
  ): VerificationResult[] {
    return [
      {
        id: uuidv4(),
        checkName: 'Element Connectivity',
        passed: relationships.length >= elements.length - 1,
        severity: 'info',
        message: `Found ${relationships.length} relationships connecting ${elements.length} elements`,
        affectedElementIds: [],
      },
      {
        id: uuidv4(),
        checkName: 'Label Completeness',
        passed: elements.every((e) => !!e.label),
        severity: 'warning',
        message: elements.every((e) => !!e.label)
          ? 'All elements have labels'
          : 'Some elements are missing labels',
        affectedElementIds: elements.filter((e) => !e.label).map((e) => e.id),
        suggestion: 'Add descriptive labels to all diagram elements for clarity',
      },
    ];
  }
}

// ---------------------------------------------------------------------------
// AI Service Factory
// ---------------------------------------------------------------------------

let _aiServiceInstance: IAIService | null = null;

export function getAIService(): IAIService {
  if (_aiServiceInstance) return _aiServiceInstance;

  const useMock = process.env.AI_SERVICE_MOCK !== 'false';

  if (useMock) {
    aiLogger.info('Using Mock AI Service (set AI_SERVICE_MOCK=false to use real AI)');
    _aiServiceInstance = new MockAIService();
  } else {
    // Real AI service would be instantiated here based on AI_MODEL env var
    // e.g. new OpenAIService() or new AnthropicService()
    aiLogger.info('Real AI Service: not yet connected — falling back to mock');
    _aiServiceInstance = new MockAIService();
  }

  return _aiServiceInstance;
}
