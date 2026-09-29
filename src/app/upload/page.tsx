import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Upload Diagram',
  description: 'Upload a diagram image for AI-powered analysis and construction sequence generation.',
};

const SUPPORTED_TYPES = [
  'Flowcharts', 'UML Class', 'UML Sequence', 'UML Use Case', 'UML Activity',
  'ER Diagrams', 'Architecture', 'Network', 'Mind Maps', 'Wireframes', 'Circuits', 'BPMN',
];

const TIPS = [
  { icon: '🔆', tip: 'Use high-contrast, clear images for better AI accuracy' },
  { icon: '📐', tip: 'Straight lines and proper shapes improve element detection' },
  { icon: '🔤', tip: 'Ensure text labels are legible — avoid handwritten diagrams' },
  { icon: '📏', tip: 'Larger images (1200px+) yield more accurate results' },
];

export default function UploadPage() {
  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">Upload Diagram</h1>
          <p className="page-subtitle">
            Upload an image to generate an AI-derived logical construction sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* Upload area */}
          <div className="space-y-4">

            {/* Dropzone */}
            <div className="dropzone p-16 text-center cursor-pointer group hover:border-indigo-500/60 hover:bg-indigo-600/[0.03] transition-all"
              id="upload-dropzone"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative">
                <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">⬆️</div>
                <h2 className="text-white font-semibold text-xl mb-2">
                  Drop your diagram image here
                </h2>
                <p className="text-slate-400 text-sm mb-2">
                  or click to browse and select a file
                </p>
                <p className="text-slate-500 text-xs mb-6">
                  Supports JPG, PNG, WebP, GIF, BMP, TIFF · Up to 20 MB
                </p>

                <label htmlFor="file-input" className="btn btn-primary btn-lg cursor-pointer">
                  Choose File
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* AI Options */}
            <div className="card">
              <h3 className="section-title mb-4">Analysis Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">Auto-generate construction sequence</div>
                    <div className="text-xs text-slate-500 mt-0.5">AI will immediately generate a step sequence after analysis</div>
                  </div>
                  <div className="toggle-track active" id="option-auto-sequence">
                    <div className="toggle-thumb" />
                  </div>
                </div>
                <hr className="divider" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">Show confidence scores</div>
                    <div className="text-xs text-slate-500 mt-0.5">Display AI confidence for each detected element</div>
                  </div>
                  <div className="toggle-track" id="option-confidence">
                    <div className="toggle-thumb" />
                  </div>
                </div>
                <hr className="divider" />
                <div>
                  <label className="label" htmlFor="diagram-type-select">Diagram type hint (optional)</label>
                  <select id="diagram-type-select" className="input">
                    <option value="">Auto-detect</option>
                    {SUPPORTED_TYPES.map((t) => (
                      <option key={t} value={t.toLowerCase().replace(/ /g, '-')}>{t}</option>
                    ))}
                  </select>
                  <p className="field-hint">Providing a hint improves AI accuracy for ambiguous diagrams.</p>
                </div>
                <div>
                  <label className="label" htmlFor="project-name">Project name (optional)</label>
                  <input
                    id="project-name"
                    type="text"
                    className="input"
                    placeholder="e.g. My ER Diagram v2"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button id="upload-analyze-btn" className="btn btn-primary btn-lg flex-1" disabled>
                  Analyze Diagram
                </button>
                <button id="upload-reset-btn" className="btn btn-secondary btn-lg">
                  Clear
                </button>
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="ai-disclaimer">
              <strong>ℹ️ Note:</strong> BuiltIt AI generates an AI-derived logical construction sequence
              based on structural analysis. This does <strong>not</strong> recover the actual historical
              drawing order from the original image.
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Supported types */}
            <div className="card">
              <h3 className="section-title mb-3">Supported Diagram Types</h3>
              <div className="flex flex-wrap gap-1.5">
                {SUPPORTED_TYPES.map((type) => (
                  <span key={type} className="badge badge-indigo py-1 px-2">{type}</span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card">
              <h3 className="section-title mb-3">Tips for Best Results</h3>
              <div className="space-y-3">
                {TIPS.map(({ icon, tip }) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                    <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* File requirements */}
            <div className="card-sm surface">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">File Requirements</h4>
              <div className="space-y-1.5">
                {[
                  ['Max file size', '20 MB'],
                  ['Formats', 'JPG, PNG, WebP, GIF, BMP, TIFF'],
                  ['Min resolution', '400 × 400 px'],
                  ['Recommended', '1200 × 900 px or larger'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-300 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick link */}
            <Link href="/workspace" className="card-sm flex items-center gap-2.5 hover:border-indigo-500/30 hover:bg-indigo-600/5 transition-all no-underline">
              <span className="text-xl">⬡</span>
              <div>
                <div className="text-white text-sm font-medium">Open Workspace</div>
                <div className="text-slate-500 text-xs">View past analyses</div>
              </div>
              <span className="ml-auto text-slate-600 text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
