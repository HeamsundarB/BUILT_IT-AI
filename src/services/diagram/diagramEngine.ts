// =============================================================================
// BUILTIT AI - Diagram Rendering Engine Interface + Mock
// =============================================================================

import { DiagramAnalysis, DiagramType } from '@/types';
import { logger } from '@/lib/logger';

export interface IDiagramEngine {
  render(analysis: DiagramAnalysis, format: 'svg' | 'canvas'): Promise<string>;
  generateMermaid(analysis: DiagramAnalysis): Promise<string>;
  generatePlantUML(analysis: DiagramAnalysis): Promise<string>;
  detectType(imageUrl: string): Promise<DiagramType>;
}

export class MockDiagramEngine implements IDiagramEngine {
  private log = logger.child('DiagramEngine');

  async render(analysis: DiagramAnalysis, format: 'svg' | 'canvas'): Promise<string> {
    this.log.debug('Rendering diagram', { id: analysis.id, format });
    await new Promise((r) => setTimeout(r, 200));

    if (format === 'svg') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#0f0f1a"/>
  <text x="400" y="280" text-anchor="middle" fill="#6366f1" font-size="24" font-family="Inter">
    ${analysis.diagramType.toUpperCase()}
  </text>
  <text x="400" y="320" text-anchor="middle" fill="#8b5cf6" font-size="14" font-family="Inter">
    ${analysis.elements.length} elements • ${analysis.relationships.length} relationships
  </text>
  <text x="400" y="360" text-anchor="middle" fill="#6b7280" font-size="11" font-family="Inter">
    AI-derived construction sequence — not historical drawing order
  </text>
</svg>`;
    }

    return 'canvas-mock-data';
  }

  async generateMermaid(analysis: DiagramAnalysis): Promise<string> {
    this.log.debug('Generating Mermaid', { id: analysis.id });
    const lines = ['flowchart TD'];
    analysis.elements.forEach((el) => {
      const label = el.label || el.type;
      lines.push(`  ${el.id.slice(0, 8)}["${label}"]`);
    });
    analysis.relationships.forEach((rel) => {
      lines.push(`  ${rel.sourceId.slice(0, 8)} --> ${rel.targetId.slice(0, 8)}`);
    });
    return lines.join('\n');
  }

  async generatePlantUML(analysis: DiagramAnalysis): Promise<string> {
    this.log.debug('Generating PlantUML', { id: analysis.id });
    const lines = ['@startuml', `title ${analysis.diagramType}`];
    analysis.elements.forEach((el) => {
      lines.push(`component "${el.label || el.type}" as ${el.id.slice(0, 8)}`);
    });
    analysis.relationships.forEach((rel) => {
      lines.push(`${rel.sourceId.slice(0, 8)} --> ${rel.targetId.slice(0, 8)}`);
    });
    lines.push('@enduml');
    return lines.join('\n');
  }

  async detectType(imageUrl: string): Promise<DiagramType> {
    const _ = imageUrl;
    return 'flowchart';
  }
}

let _diagramEngineInstance: IDiagramEngine | null = null;
export function getDiagramEngine(): IDiagramEngine {
  if (_diagramEngineInstance) return _diagramEngineInstance;
  _diagramEngineInstance = new MockDiagramEngine();
  return _diagramEngineInstance;
}
