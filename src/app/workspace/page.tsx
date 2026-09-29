import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Analysis Workspace',
  description: 'Analyze diagrams and view AI-derived construction sequences.',
};

const MOCK_STEPS = [
  { id: 1, text: 'Define User entity with attributes: id, name, email, created_at', status: 'done', type: 'Entity' },
  { id: 2, text: 'Add Product entity: id, name, description, price, stock_qty', status: 'done', type: 'Entity' },
  { id: 3, text: 'Create Order entity and establish relationship with User (1:N)', status: 'active', type: 'Relationship' },
  { id: 4, text: 'Add OrderItem junction table linking Order and Product (M:N)', status: 'pending', type: 'Junction' },
  { id: 5, text: 'Define Category entity and relate to Product (1:N)', status: 'pending', type: 'Entity' },
  { id: 6, text: 'Add primary keys, foreign keys, and indexes', status: 'pending', type: 'Constraint' },
];

const MOCK_ELEMENTS = [
  { type: 'Entity', name: 'User', confidence: 98, attrs: 4 },
  { type: 'Entity', name: 'Product', confidence: 96, attrs: 6 },
  { type: 'Entity', name: 'Order', confidence: 94, attrs: 3 },
  { type: 'Relationship', name: 'User → Order (1:N)', confidence: 91, attrs: 0 },
  { type: 'Junction', name: 'OrderItem', confidence: 88, attrs: 2 },
  { type: 'Entity', name: 'Category', confidence: 85, attrs: 2 },
];

const WORKSPACE_TABS = ['Analysis', 'Construction', 'AI Teacher', 'Export'] as const;

export default function WorkspacePage() {
  return (
    <AppShell
      header={
        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
          {WORKSPACE_TABS.map((tab, i) => (
            <button
              key={tab}
              className={`workspace-tab flex-shrink-0 ${i === 0 ? 'active' : ''}`}
              id={`workspace-tab-${tab.toLowerCase().replace(/ /g, '-')}`}
            >
              {tab}
            </button>
          ))}
          <div className="flex-1" />
          <Link href="/upload" className="btn btn-secondary btn-sm flex-shrink-0">← Back</Link>
        </div>
      }
    >
      <div className="h-full flex flex-col overflow-hidden">

        {/* ── Empty state: no diagram loaded ── */}
        {/* Swap this section out when a diagram is loaded */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-5 opacity-30">🔬</div>
            <h2 className="text-white font-bold text-xl mb-2">No diagram loaded</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Upload a diagram image to begin AI-powered analysis. The construction sequence,
              element list, and AI Teacher will appear here once analysis is complete.
            </p>
            <Link href="/upload" className="btn btn-primary btn-lg">
              Upload a Diagram
            </Link>
          </div>
        </div>

        {/* ── MOCK STATE: uncomment / toggle to show a "loaded" analysis ──
        The section below shows what the workspace looks like with data.
        It's marked [MOCK] and not interactive. */}
      </div>

      {/* ── Mock Workspace Preview (below fold — visible for demonstration) ── */}
      <div className="border-t border-white/[0.07] bg-[#0d1220]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="badge badge-amber">⚠ Mock State</span>
          <span className="text-xs text-slate-500">This preview shows what the workspace looks like with a loaded diagram. Real data populates after upload + analysis.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] border-t border-white/[0.07]" style={{ height: '520px' }}>

          {/* Left: Canvas area (mock) */}
          <div className="border-r border-white/[0.07] flex flex-col overflow-hidden">

            {/* Diagram placeholder */}
            <div className="flex-1 flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="relative text-center">
                <div className="text-5xl mb-3 opacity-20">📊</div>
                <p className="text-slate-600 text-sm">ER Diagram canvas</p>
                <p className="text-slate-700 text-xs mt-1">Step 3 of 6 highlighted</p>
              </div>
            </div>

            {/* Canvas toolbar */}
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-t border-white/[0.07] bg-[#0d1220]">
              <span className="text-slate-500 text-xs">Zoom:</span>
              {['50%', '100%', '150%', 'Fit'].map((z) => (
                <button key={z} className={`btn btn-ghost btn-xs ${z === '100%' ? 'bg-white/[0.06] text-white' : ''}`}>{z}</button>
              ))}
              <div className="flex-1" />
              <span className="badge badge-teal text-[10px]">AI Analyzed</span>
              <span className="text-xs text-slate-500">94% confidence</span>
            </div>
          </div>

          {/* Right: Steps + Analysis panel */}
          <div className="overflow-y-auto flex flex-col">

            {/* Panel tabs */}
            <div className="flex-shrink-0 flex border-b border-white/[0.07] px-2 pt-2 gap-1 bg-[#0d1220]">
              {['Steps', 'Elements', 'Chat'].map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
                    i === 0
                      ? 'text-indigo-300 border-indigo-500'
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Steps list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {MOCK_STEPS.map(({ id, text, status, type }) => (
                <div
                  key={id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                    status === 'active'
                      ? 'border-indigo-500/30 bg-indigo-600/10'
                      : status === 'done'
                      ? 'border-white/[0.05] bg-white/[0.02] opacity-70'
                      : 'border-white/[0.04] bg-transparent opacity-40'
                  }`}
                >
                  <div className={`step-dot mt-0.5 flex-shrink-0 text-[10px] ${
                    status === 'done' ? 'step-dot-complete' :
                    status === 'active' ? 'step-dot-active' :
                    'step-dot-pending'
                  }`}>
                    {status === 'done' ? '✓' : id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-snug">{text}</p>
                    <span className="badge badge-gray mt-1 text-[9px]">{type}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Elements list (mock second tab) */}
            <div className="flex-shrink-0 border-t border-white/[0.07] p-3">
              <div className="text-xs text-slate-500 mb-2 font-medium">Detected Elements</div>
              <div className="space-y-1.5">
                {MOCK_ELEMENTS.map(({ type, name, confidence }) => (
                  <div key={name} className="flex items-center gap-2 text-xs">
                    <span className={`badge text-[9px] flex-shrink-0 ${
                      type === 'Entity' ? 'badge-indigo' :
                      type === 'Relationship' ? 'badge-teal' :
                      type === 'Junction' ? 'badge-violet' :
                      'badge-amber'
                    }`}>{type}</span>
                    <span className="text-slate-300 flex-1 truncate">{name}</span>
                    <span className="text-slate-600 flex-shrink-0">{confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="flex-shrink-0 p-3 pt-0">
              <div className="ai-disclaimer text-[11px]">
                AI-derived sequence — not the original drawing order.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
