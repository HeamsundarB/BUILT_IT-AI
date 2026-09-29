import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help & Documentation',
  description: 'Get help and learn how to use BuiltIt AI.',
};

const FAQ = [
  {
    q: 'What does BuiltIt AI do?',
    a: 'BuiltIt AI analyzes diagram images and generates an AI-derived logical construction sequence to help you understand and practice rebuilding them step by step. It\'s a visual learning tool, not a drawing recovery system.',
  },
  {
    q: 'Does it recover the actual drawing order from the original image?',
    a: 'No. BuiltIt AI generates a logically derived construction sequence based on structural analysis. It does NOT recover the actual historical drawing order from the original image. This is a plausible learning path, not a forensic reconstruction.',
  },
  {
    q: 'What diagram types are supported?',
    a: 'Flowcharts, UML (Class, Sequence, Use Case, Activity, State), ER Diagrams, Architecture diagrams, Network diagrams, Mind Maps, Wireframes, BPMN, and Circuit diagrams.',
  },
  {
    q: 'How do I upload a diagram?',
    a: 'Navigate to the Upload page, drag and drop your image or click "Choose File". Supported formats: JPG, PNG, WebP, GIF, BMP, TIFF. Maximum file size: 20MB.',
  },
  {
    q: 'What practice modes are available?',
    a: 'Guided (step-by-step with AI hints), Free (no hints, self-paced), Timed (race against the clock), and Challenge (advanced scoring with hint costs).',
  },
  {
    q: 'What export formats are supported?',
    a: 'PNG, SVG, PDF, JSON, Mermaid markup, PlantUML, and MP4 (animated construction video).',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'Accuracy depends on diagram complexity and image quality. Simple, well-labeled flowcharts typically achieve 90%+ element detection accuracy. Complex multi-layer diagrams may need manual review. Always verify AI output.',
  },
  {
    q: 'How do I use the AI Teacher?',
    a: 'Once a diagram is analyzed, open the Analysis Workspace and switch to the "AI Teacher" tab. Type any question about the diagram, its elements, the construction logic, or underlying concepts.',
  },
];

const QUICK_LINKS = [
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'Upload your first diagram and generate a construction sequence',
    href: '/upload',
  },
  {
    icon: '🔬',
    title: 'Analysis Workspace',
    desc: 'Explore the full analysis view with steps and AI Teacher',
    href: '/workspace',
  },
  {
    icon: '🎯',
    title: 'Practice Modes',
    desc: 'Learn all 4 practice modes and their features',
    href: '/practice',
  },
  {
    icon: '⚙️',
    title: 'Settings Guide',
    desc: 'Configure your account, AI options, and export preferences',
    href: '/settings',
  },
];

const SHORTCUTS = [
  { key: 'Space', action: 'Show/hide hint in practice mode' },
  { key: '← →', action: 'Navigate between construction steps' },
  { key: 'R', action: 'Reset current step' },
  { key: 'Ctrl+Z', action: 'Undo last action' },
  { key: 'Ctrl+S', action: 'Export current state' },
  { key: 'Esc', action: 'Close modal / cancel' },
  { key: '+/-', action: 'Zoom in / out on canvas' },
  { key: 'F', action: 'Fit diagram to canvas' },
];

export default function HelpPage() {
  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Help & Documentation</h1>
          <p className="page-subtitle">Learn how to get the most out of BuiltIt AI.</p>
        </div>

        {/* AI Disclaimer — prominent */}
        <div className="ai-disclaimer mb-6">
          <p className="font-semibold text-amber-300 mb-1.5">⚠ Important — AI Disclaimer</p>
          <p className="text-[0.8125rem] leading-relaxed">
            BuiltIt AI generates <strong>AI-derived logical construction sequences</strong> based on
            structural analysis of diagram images. These sequences represent a plausible logical
            reconstruction approach and <strong>do NOT</strong> represent or recover the actual
            historical drawing order used when the original diagram was created.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Quick Links */}
            <div className="card">
              <h2 className="section-title mb-4">Quick Start</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_LINKS.map(({ icon, title, desc, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-indigo-500/30 hover:bg-indigo-600/[0.04] transition-all no-underline"
                  >
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <div className="text-white text-sm font-semibold mb-0.5">{title}</div>
                      <div className="text-slate-400 text-xs leading-snug">{desc}</div>
                    </div>
                    <span className="text-slate-600 text-xs ml-auto flex-shrink-0 mt-0.5">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="card">
              <h2 className="section-title mb-5">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQ.map(({ q, a }) => (
                  <details key={q} className="group overflow-hidden rounded-xl border border-white/[0.07]">
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-white font-medium text-sm hover:bg-white/[0.03] transition-colors list-none select-none">
                      <span className="pr-4">{q}</span>
                      <span className="text-slate-500 flex-shrink-0 group-open:rotate-180 transition-transform duration-200 text-xs">▾</span>
                    </summary>
                    <div className="px-4 py-4 text-slate-400 text-sm border-t border-white/[0.07] bg-white/[0.02] leading-relaxed">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* How to use AI Teacher */}
            <div className="card">
              <h2 className="section-title mb-4">Using the AI Teacher</h2>
              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>
                  The AI Teacher is a conversational assistant that answers questions about your specific diagram.
                  Unlike a general chatbot, it has full context about your uploaded diagram, the detected elements,
                  and the construction sequence.
                </p>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                  <p className="text-white text-xs font-semibold mb-2">Example questions you can ask:</p>
                  {[
                    'Why does this step come before that one?',
                    'What type of relationship is this?',
                    'Explain what a foreign key is in this context',
                    'What would happen if I reversed steps 3 and 4?',
                    'Give me a simpler explanation of UML inheritance',
                  ].map((q) => (
                    <div key={q} className="chat-bubble-user text-xs py-2 px-3">{q}</div>
                  ))}
                </div>
                <p>
                  To access the AI Teacher: Upload a diagram → Wait for analysis → Open Workspace → Click &quot;AI Teacher&quot; tab.
                </p>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Keyboard shortcuts */}
            <div className="card">
              <h2 className="section-title mb-4">Keyboard Shortcuts</h2>
              <div className="space-y-2.5">
                {SHORTCUTS.map(({ key, action }) => (
                  <div key={key} className="flex items-center gap-3">
                    <kbd className="px-2 py-0.5 rounded bg-white/[0.07] border border-white/[0.12] text-slate-200 font-mono text-[11px] flex-shrink-0 min-w-[2.5rem] text-center">
                      {key}
                    </kbd>
                    <span className="text-slate-400 text-xs">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export formats */}
            <div className="card">
              <h2 className="section-title mb-3">Supported Export Formats</h2>
              <div className="space-y-2">
                {[
                  { fmt: 'PNG', desc: 'High-res image', badge: 'Image' },
                  { fmt: 'SVG', desc: 'Scalable vector', badge: 'Vector' },
                  { fmt: 'PDF', desc: 'Print-ready document', badge: 'Document' },
                  { fmt: 'JSON', desc: 'Structured data', badge: 'Data' },
                  { fmt: 'Mermaid', desc: 'Mermaid.js markup', badge: 'Code' },
                  { fmt: 'PlantUML', desc: 'PlantUML syntax', badge: 'Code' },
                  { fmt: 'MP4', desc: 'Animated video', badge: 'Video' },
                ].map(({ fmt, desc, badge }) => (
                  <div key={fmt} className="flex items-center gap-2 text-xs">
                    <span className="badge badge-indigo text-[9px] w-12 justify-center">{fmt}</span>
                    <span className="text-slate-400 flex-1">{desc}</span>
                    <span className="badge badge-gray text-[9px]">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="card">
              <h2 className="section-title mb-3">Need More Help?</h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                If you can&apos;t find what you&apos;re looking for, reach out via email.
              </p>
              <a
                href="mailto:support@builtitai.com"
                className="btn btn-secondary btn-sm w-full"
              >
                ✉ Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
