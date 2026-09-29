import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practice',
  description: 'Practice reconstructing diagrams step by step with AI guidance.',
};

const PRACTICE_MODES = [
  {
    mode: 'Guided',
    class: 'guided',
    icon: '🧭',
    color: 'indigo',
    desc: 'Step-by-step AI guidance with hints at every stage. Perfect for beginners.',
    features: ['AI hints on demand', 'Step validation', 'Voice guidance', 'Undo/Redo'],
  },
  {
    mode: 'Free',
    class: 'free',
    icon: '🎨',
    color: 'teal',
    desc: 'Reconstruct freely without hints. Test your understanding independently.',
    features: ['No hints', 'Self-paced', 'Final comparison', 'Export result'],
  },
  {
    mode: 'Timed',
    class: 'timed',
    icon: '⏱️',
    color: 'amber',
    desc: 'Race against the clock. Complete the reconstruction before time runs out.',
    features: ['Countdown timer', 'Speed scoring', 'Leaderboard-ready', 'Replay'],
  },
  {
    mode: 'Challenge',
    class: 'challenge',
    icon: '🏆',
    color: 'violet',
    desc: 'Advanced mode with scoring, penalties, and progressive difficulty.',
    features: ['Scoring system', 'Step penalties', 'Hint cost', 'Achievement badges'],
  },
];

const PROGRESS_METRICS = [
  { label: 'Practice Sessions', value: 0, max: 20 },
  { label: 'Avg. Accuracy', value: 0, max: 100, suffix: '%' },
  { label: 'Steps Completed', value: 0, max: 200 },
  { label: 'Challenges Won', value: 0, max: 10 },
];

export default function PracticePage() {
  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        {/* Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Practice Mode</h1>
            <p className="page-subtitle">
              Reconstruct diagrams step by step and test your understanding.
            </p>
          </div>
          <Link href="/upload" className="btn btn-primary btn-sm flex-shrink-0">
            + Upload to Practice
          </Link>
        </div>

        {/* Modes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {PRACTICE_MODES.map(({ mode, class: cls, icon, desc, features, color }) => (
            <div key={mode} className={`mode-card ${cls}`}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-white font-bold text-[0.9375rem] mb-1.5">{mode}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{desc}</p>
              <ul className="space-y-1 mb-4">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className={`text-${color === 'indigo' ? 'indigo' : color === 'teal' ? 'teal' : color === 'amber' ? 'amber' : 'violet'}-400 text-[10px]`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`btn btn-sm w-full ${color === 'indigo' ? 'btn-primary' : 'btn-secondary'}`}
                disabled
                title="Upload a diagram first to start practice"
              >
                Select Mode
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Practice Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title">Recent Practice Sessions</h2>
                  <p className="section-subtitle">Your latest reconstruction attempts</p>
                </div>
                <Link href="/history" className="btn btn-ghost btn-sm">View All →</Link>
              </div>

              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-5xl mb-4 opacity-30">🎯</div>
                <h3 className="text-white font-semibold mb-2">No practice sessions yet</h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-4">
                  Analyze a diagram first, then start a practice session to test your
                  reconstruction skills and track your progress.
                </p>
                <Link href="/upload" className="btn btn-primary btn-sm">
                  Upload First Diagram
                </Link>
              </div>
            </div>

            {/* How practice works */}
            <div className="card">
              <h2 className="section-title mb-4">How Practice Works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { step: '1', icon: '⬆️', label: 'Upload', desc: 'Upload any diagram image to the AI analyzer' },
                  { step: '2', icon: '🔬', label: 'Analyze', desc: 'AI generates a logical step-by-step construction sequence' },
                  { step: '3', icon: '🎯', label: 'Practice', desc: 'Choose a mode and try to reconstruct it yourself' },
                ].map(({ step, icon, label, desc }) => (
                  <div key={step} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-white text-sm font-semibold mb-1">{label}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">

            {/* Progress */}
            <div className="card">
              <h2 className="section-title mb-4">Your Progress</h2>
              <div className="space-y-4">
                {PROGRESS_METRICS.map(({ label, value, max, suffix }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-500">{value}{suffix ?? ''}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${(value / max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.07] text-center">
                <div className="text-xs text-slate-500">Complete practice sessions to build your progress</div>
              </div>
            </div>

            {/* Tips */}
            <div className="card">
              <h2 className="section-title mb-3">Practice Tips</h2>
              <div className="space-y-3">
                {[
                  { icon: '🧭', tip: 'Start with Guided mode to understand the AI sequence first' },
                  { icon: '👁️', tip: 'Study the full construction sequence before attempting Free mode' },
                  { icon: '⏱️', tip: 'Use Timed mode only after you feel comfortable with the diagram' },
                  { icon: '🔁', tip: 'Repeat the same diagram in different modes for best learning' },
                ].map(({ icon, tip }) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
                    <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortcuts */}
            <div className="card-sm surface">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Keyboard Shortcuts</h4>
              <div className="space-y-1.5">
                {[
                  ['Space', 'Show/hide hint'],
                  ['← →', 'Navigate steps'],
                  ['R', 'Reset current step'],
                  ['Ctrl+Z', 'Undo last action'],
                ].map(([key, action]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/[0.1] text-slate-300 font-mono text-[10px]">{key}</kbd>
                    <span className="text-slate-500">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
