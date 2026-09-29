import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BuiltIt AI — Upload. Analyze. Build.',
  description:
    'AI-powered visual analysis, reconstruction, learning and practice platform. Upload any diagram image and get an AI-derived logical construction sequence instantly.',
};

interface Feature {
  icon: string;
  label: string;
  title: string;
  desc: string;
  badgeCls: string;
  iconBg: string;
  iconBorder: string;
}

const FEATURES: Feature[] = [
  {
    icon: '🔬',
    label: 'AI Analysis',
    title: 'Deep Visual Understanding',
    desc: 'Our AI identifies elements, relationships, layers, and hierarchies to generate a logical construction sequence from any diagram image.',
    badgeCls: 'badge-indigo',
    iconBg: 'rgba(99,102,241,0.12)',
    iconBorder: 'rgba(99,102,241,0.25)',
  },
  {
    icon: '📋',
    label: 'Step Reconstruction',
    title: 'Logical Build Sequences',
    desc: 'Get an AI-derived step-by-step construction plan — not the original drawing order, but a logical approach for learning and understanding.',
    badgeCls: 'badge-teal',
    iconBg: 'rgba(20,184,166,0.12)',
    iconBorder: 'rgba(20,184,166,0.25)',
  },
  {
    icon: '🎓',
    label: 'AI Teacher',
    title: 'Conversational Learning',
    desc: 'Ask questions about any element, step, or concept. The AI Teacher explains your diagram in depth, adapting to your level.',
    badgeCls: 'badge-violet',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.25)',
  },
  {
    icon: '🎯',
    label: 'Practice Mode',
    title: 'Hands-On Reconstruction',
    desc: 'Reconstruct diagrams step by step in Guided, Free, Timed, or Challenge mode. Track your progress over time.',
    badgeCls: 'badge-amber',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.25)',
  },
  {
    icon: '📤',
    label: 'Export',
    title: 'Export Everywhere',
    desc: 'Export as PNG, SVG, PDF, JSON, Mermaid, PlantUML, or an animated MP4 video of the reconstruction sequence.',
    badgeCls: 'badge-green',
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.25)',
  },
  {
    icon: '🔊',
    label: 'Voice Guidance',
    title: 'Learn by Listening',
    desc: 'Hear step-by-step instructions read aloud while you practice reconstruction — hands-free learning at its best.',
    badgeCls: 'badge-blue',
    iconBg: 'rgba(59,130,246,0.12)',
    iconBorder: 'rgba(59,130,246,0.25)',
  },
];

const DIAGRAM_TYPES = [
  'Flowcharts', 'UML Class', 'UML Sequence', 'UML Use Case', 'UML Activity',
  'ER Diagrams', 'Architecture', 'Network', 'Mind Maps', 'Wireframes', 'Circuits', 'BPMN',
];

interface PreviewStep {
  step: number;
  text: string;
  done?: boolean;
  active?: boolean;
}

const PREVIEW_STEPS: PreviewStep[] = [
  { step: 1, text: 'Define User entity with attributes: id, name, email', done: true },
  { step: 2, text: 'Add Product entity with price, stock fields', done: true },
  { step: 3, text: 'Create Order entity and link to User (1:N)', active: true },
  { step: 4, text: 'Add OrderItem junction table', done: false },
  { step: 5, text: 'Define Category entity and relate to Product', done: false },
];

const STATS = [
  { value: '50+', label: 'Diagram Types' },
  { value: '6',   label: 'Export Formats' },
  { value: '4',   label: 'Practice Modes' },
  { value: 'AI',  label: 'Powered Analysis' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Your Diagram',
    desc: 'Drop any diagram image — flowcharts, UML, ER, architecture, network, mind maps, and more. Supports JPG, PNG, WebP up to 20 MB.',
    icon: '⬆️',
  },
  {
    step: '02',
    title: 'AI Analyzes & Sequences',
    desc: 'Our AI identifies elements, relationships, layers and generates a logical construction sequence — not the drawing order, but a structured learning path.',
    icon: '🔬',
  },
  {
    step: '03',
    title: 'Learn & Practice',
    desc: 'Follow the construction sequence, ask the AI Teacher anything, practice rebuilding in your preferred mode, and export your work.',
    icon: '🎯',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Does it recover the actual drawing order from the image?',
    a: 'No. BuiltIt AI generates a logically derived construction sequence based on structural analysis — not the original drawing order. This is a plausible learning path, not a forensic reconstruction.',
  },
  {
    q: 'What diagram types does it support?',
    a: 'Flowcharts, UML (Class, Sequence, Use Case, Activity, State), ER Diagrams, Architecture diagrams, Network diagrams, Mind Maps, Wireframes, BPMN, and Circuit diagrams.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes. The free plan includes 10 diagram uploads and full access to all analysis features. No credit card required.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'Accuracy varies by diagram type and image quality. Simple flowcharts typically achieve 90%+ accuracy. Complex multi-layer diagrams may require manual review.',
  },
  {
    q: 'What export formats are supported?',
    a: 'PNG, SVG, PDF, JSON, Mermaid, PlantUML, and MP4 (animated construction video).',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] relative overflow-x-hidden">

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-indigo-600/8 blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 h-80 w-80 rounded-full bg-violet-700/6 blur-[120px] pointer-events-none" />

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0f1117]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" style={{ height: '3.75rem' }}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none tracking-tight">BuiltIt AI</div>
              <div className="text-[10px] text-indigo-400/70 leading-none mt-0.5">Upload. Analyze. Build.</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="btn btn-ghost btn-sm hidden sm:flex">Sign In</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="hero-badge mb-7 animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
          AI-Powered Diagram Analysis Platform
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 animate-slide-up">
          Upload.{' '}
          <span className="text-gradient">Analyze.</span>{' '}
          Build.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed animate-slide-up delay-100">
          Upload any diagram image. Get an AI-derived logical construction sequence.
          Practice rebuilding it step by step — and truly understand it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up delay-200">
          <Link href="/signup" className="btn btn-primary btn-xl">
            Start for Free →
          </Link>
          <Link href="/dashboard" className="btn btn-secondary btn-xl">
            View Dashboard
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto animate-slide-up delay-300">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-card text-center py-3 px-2">
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="ai-disclaimer max-w-xl mx-auto mt-8 text-left animate-fade-in delay-400">
          <strong>ℹ️ Important:</strong> BuiltIt AI generates AI-derived logical construction sequences.
          This does <strong>not</strong> represent the actual historical drawing order from the original image.
          It provides a plausible logical approach for learning purposes.
        </div>
      </section>

      {/* ── Preview Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* AI Analysis preview */}
          <div className="card border-white/[0.07] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="badge badge-indigo mb-1.5">AI Analysis</div>
                <h3 className="text-white font-semibold text-sm">ER Diagram — Detected Elements</h3>
              </div>
              <span className="badge badge-green">✓ Complete</span>
            </div>

            <div className="space-y-2">
              {[
                { type: 'Entity',       name: 'User',                 badgeCls: 'badge-indigo', attrs: 4 },
                { type: 'Entity',       name: 'Product',              badgeCls: 'badge-indigo', attrs: 6 },
                { type: 'Entity',       name: 'Order',                badgeCls: 'badge-indigo', attrs: 3 },
                { type: 'Relationship', name: 'places (1:N)',         badgeCls: 'badge-teal',   attrs: 0 },
                { type: 'Attribute',    name: 'Primary Keys ×3',      badgeCls: 'badge-amber',  attrs: 0 },
              ].map(({ type, name, badgeCls, attrs }) => (
                <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <span className={`badge ${badgeCls} text-[10px]`}>{type}</span>
                  <span className="text-sm text-slate-200 font-medium flex-1">{name}</span>
                  {attrs > 0 && <span className="text-xs text-slate-500">{attrs} attrs</span>}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-500">
              <span>AI Confidence: 94%</span>
              <span>Analyzed in 1.2s</span>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-600/8 blur-2xl pointer-events-none" />
          </div>

          {/* Step Reconstruction preview */}
          <div className="card border-white/[0.07] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="badge badge-teal mb-1.5">Step Reconstruction</div>
                <h3 className="text-white font-semibold text-sm">AI Construction Sequence</h3>
              </div>
              <span className="text-xs text-slate-500">Step 3 of 5</span>
            </div>

            <div className="space-y-2">
              {PREVIEW_STEPS.map(({ step, text, done, active }) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                    active
                      ? 'bg-indigo-600/10 border-indigo-500/30'
                      : done
                      ? 'bg-white/[0.02] border-transparent opacity-70'
                      : 'bg-white/[0.01] border-transparent opacity-40'
                  }`}
                >
                  <div className={`step-dot flex-shrink-0 ${active ? 'step-dot-active' : done ? 'step-dot-complete' : 'step-dot-pending'}`}>
                    {done ? '✓' : step}
                  </div>
                  <span className="text-xs text-slate-300 leading-snug">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.07]">
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: '60%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                <span>3 of 5 steps</span>
                <span>60% complete</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-teal-500/8 blur-2xl pointer-events-none" />
          </div>

          {/* AI Teacher preview */}
          <div className="card border-white/[0.07] relative overflow-hidden">
            <div className="mb-4">
              <div className="badge badge-violet mb-1.5">AI Teacher</div>
              <h3 className="text-white font-semibold text-sm">Ask anything about your diagram</h3>
            </div>

            <div className="space-y-3">
              <div className="chat-bubble-user text-xs">
                Why does Order come before OrderItem in the sequence?
              </div>
              <div className="chat-bubble-ai text-xs leading-relaxed">
                <strong>Order</strong> is a primary entity that establishes the main transaction record.
                <strong> OrderItem</strong> is a junction table that depends on both <strong>Order</strong> and
                <strong> Product</strong> existing first — it holds foreign keys to both. So we must create
                parent entities before defining the relationships between them.
              </div>
              <div className="chat-bubble-user text-xs">
                What type of relationship is between User and Order?
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <div
                className="flex-1 input text-xs text-slate-600"
                style={{ padding: '0.5rem 0.75rem', cursor: 'not-allowed' }}
              >
                Ask the AI Teacher... [preview only]
              </div>
              <button className="btn btn-primary btn-sm" disabled>Send</button>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-violet-600/8 blur-2xl pointer-events-none" />
          </div>

          {/* Practice Mode preview */}
          <div className="card border-white/[0.07] relative overflow-hidden">
            <div className="mb-4">
              <div className="badge badge-amber mb-1.5">Practice Mode</div>
              <h3 className="text-white font-semibold text-sm">Choose your challenge</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { mode: 'Guided',    icon: '🧭', desc: 'Step-by-step with AI hints',  selected: true  },
                { mode: 'Free',      icon: '🎨', desc: 'Reconstruct without hints',   selected: false },
                { mode: 'Timed',     icon: '⏱️', desc: 'Race against the clock',      selected: false },
                { mode: 'Challenge', icon: '🏆', desc: 'Advanced with scoring',       selected: false },
              ].map(({ mode, icon, desc, selected }) => (
                <div
                  key={mode}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-indigo-500/40 bg-indigo-600/10'
                      : 'border-white/[0.07] bg-white/[0.02] opacity-60'
                  }`}
                >
                  <div className="text-xl mb-1.5">{icon}</div>
                  <div className="text-white text-xs font-semibold">{mode}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5 leading-snug">{desc}</div>
                  {selected && <div className="mt-1.5 badge badge-indigo text-[9px]">Selected</div>}
                </div>
              ))}
            </div>

            <button className="btn btn-primary w-full mt-4 btn-sm" disabled>
              🎯 Start Practice Session [preview only]
            </button>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-500/6 blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.07]">
        <div className="text-center mb-12">
          <div className="hero-badge mb-4 mx-auto w-fit">Platform Features</div>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Everything you need to{' '}
            <span className="text-gradient">understand diagrams</span>
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            A complete platform for visual analysis, AI-powered reconstruction, and hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, label, title, desc, badgeCls, iconBg, iconBorder }, i) => (
            <div
              key={title}
              className="feature-card animate-slide-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
              >
                {icon}
              </div>
              <div className={`badge ${badgeCls} mb-2`}>{label}</div>
              <h3 className="text-white font-semibold mb-2 text-[0.9375rem]">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.07]">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">How It Works</h2>
          <p className="text-slate-400 text-base">Three steps to understanding any diagram.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
            <div key={step} className="step-card">
              <div className="step-number mx-auto">{step}</div>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-white font-bold mb-2 text-[0.9375rem]">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Supported Diagrams ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/[0.07]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Supports All Major Diagram Types</h2>
          <p className="text-slate-400 text-sm">If you can draw it, BuiltIt AI can analyze it.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {DIAGRAM_TYPES.map((type) => (
            <span key={type} className="badge badge-indigo py-1.5 px-3.5 text-[0.75rem]">{type}</span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.07]">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Clear answers to common questions.</p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map(({ q, a }) => (
            <details key={q} className="group card-sm border border-white/[0.07] overflow-hidden">
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
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-indigo-500/20 p-10 sm:p-14 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(15,17,23,0.8) 100%)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.07),transparent_70%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Ready to analyze your first diagram?
            </h2>
            <p className="text-slate-300 text-base mb-8 max-w-md mx-auto">
              Free to start. No credit card required. Upload a diagram and see the AI construction sequence in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="btn btn-primary btn-xl">
                Get Started Free →
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">B</span>
              </div>
              <div>
                <div className="text-white text-sm font-semibold">BuiltIt AI</div>
                <div className="text-slate-500 text-[10px]">Upload. Analyze. Build.</div>
              </div>
            </div>
            <p className="text-slate-600 text-xs text-center">
              © 2026 BuiltIt AI. AI-derived construction sequences — not historical drawing order.
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: 'Help',    href: '/help' },
                { label: 'Login',   href: '/login' },
                { label: 'Sign Up', href: '/signup' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
