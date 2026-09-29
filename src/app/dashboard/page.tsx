'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';

interface DashboardData {
  stats: {
    projects: number;
    analyses: number;
    conversations: number;
    practiceSessions: number;
  };
  recentProjects: Array<{
    id: string; name: string; description?: string;
    status: string; diagram_type?: string; updated_at: string;
  }>;
  recentConversations: Array<{
    id: string; title: string; is_pinned: number;
    updated_at: string; message_count?: number; last_message?: string;
  }>;
  recentPractice: Array<{
    id: string; mode: string; status: string;
    started_at: string; accuracy?: number; score?: number;
  }>;
}

const PRACTICE_MODES = [
  { mode: 'Guided',    icon: '🧭', color: 'indigo' },
  { mode: 'Free',      icon: '🎨', color: 'teal' },
  { mode: 'Timed',     icon: '⏱️', color: 'amber' },
  { mode: 'Challenge', icon: '🏆', color: 'violet' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/stats')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        {/* Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="page-title">
              {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Dashboard'}
            </h1>
            <p className="page-subtitle">Your workspace at a glance.</p>
          </div>
          <Link href="/upload" className="btn btn-primary btn-sm flex-shrink-0">+ New Analysis</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Projects',          value: stats?.projects ?? '—',          icon: '🗂️', badge: 'badge-indigo' },
            { label: 'Analyses',          value: stats?.analyses ?? '—',          icon: '🔬', badge: 'badge-teal' },
            { label: 'AI Chats',          value: stats?.conversations ?? '—',     icon: '💬', badge: 'badge-violet' },
            { label: 'Practice Sessions', value: stats?.practiceSessions ?? '—',  icon: '🎯', badge: 'badge-amber' },
          ].map(({ label, value, icon, badge }, i) => (
            <div key={label} className={`stat-card animate-slide-up`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{icon}</div>
                <span className={`badge ${badge}`}>{loading ? '…' : value}</span>
              </div>
              <div className="stat-value">{loading ? '—' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Recent Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title">Recent Projects</h2>
                  <p className="section-subtitle">Your latest diagram analyses</p>
                </div>
                <Link href="/upload" className="btn btn-primary btn-sm">+ New</Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
                  ))}
                </div>
              ) : data?.recentProjects.length ? (
                <div className="space-y-2">
                  {data.recentProjects.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all">
                      <div className="h-9 w-9 rounded-lg bg-indigo-600/15 flex items-center justify-center text-lg flex-shrink-0">📊</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{p.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
                          {p.diagram_type && <span className="badge badge-gray text-[9px]">{p.diagram_type}</span>}
                          <span>{timeAgo(p.updated_at)}</span>
                        </div>
                      </div>
                      <Link href={`/workspace?project=${p.id}`} className="btn btn-ghost btn-xs flex-shrink-0">Open →</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-5xl mb-4 opacity-30">🗂️</div>
                  <h3 className="text-white font-semibold mb-2">No projects yet</h3>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-4">
                    Upload your first diagram image to get started.
                  </p>
                  <Link href="/upload" className="btn btn-primary btn-sm">Create First Project</Link>
                </div>
              )}
            </div>

            {/* Recent AI Chats */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title">Recent AI Chats</h2>
                  <p className="section-subtitle">Conversations with the AI Teacher</p>
                </div>
                <Link href="/history" className="btn btn-ghost btn-sm">View All →</Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1,2].map((i) => <div key={i} className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />)}
                </div>
              ) : data?.recentConversations.length ? (
                <div className="space-y-2">
                  {data.recentConversations.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all">
                      <div className="text-lg flex-shrink-0">{c.is_pinned ? '📌' : '💬'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{c.title}</div>
                        <div className="text-slate-500 text-xs mt-0.5 truncate">
                          {c.last_message ?? 'No messages yet'} · {timeAgo(c.updated_at)}
                        </div>
                      </div>
                      {c.message_count !== undefined && (
                        <span className="badge badge-gray text-[10px] flex-shrink-0">{c.message_count} msg</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-3 opacity-30">💬</div>
                  <p className="text-slate-400 text-sm">No chats yet. Start analyzing a diagram to chat with the AI Teacher.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Quick Actions */}
            <div className="card">
              <h2 className="section-title mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { href: '/upload',   icon: '⬆️', label: 'New Analysis',   desc: 'Upload a diagram', primary: true },
                  { href: '/practice', icon: '🎯', label: 'Practice Mode',  desc: 'Reconstruct diagrams', primary: false },
                  { href: '/history',  icon: '📋', label: 'View History',   desc: 'Past sessions', primary: false },
                  { href: '/help',     icon: '💡', label: 'Get Started',    desc: 'Learn BuiltIt AI', primary: false },
                ].map(({ href, icon, label, desc, primary }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      primary
                        ? 'border-indigo-500/30 bg-indigo-600/10 hover:bg-indigo-600/15'
                        : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium ${primary ? 'text-indigo-200' : 'text-white'}`}>{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{desc}</div>
                    </div>
                    <span className="text-slate-600 text-xs flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Practice Modes */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Practice</h2>
                <Link href="/practice" className="btn btn-ghost btn-sm text-xs">All →</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRACTICE_MODES.map(({ mode, icon }) => (
                  <Link
                    key={mode}
                    href="/practice"
                    className="flex flex-col p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                  >
                    <span className="text-xl mb-1.5">{icon}</span>
                    <span className="text-white text-xs font-semibold">{mode}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="card">
              <h2 className="section-title mb-4">Progress</h2>
              <div className="space-y-3">
                {[
                  { label: 'Diagrams Analyzed', value: stats?.analyses ?? 0, max: 10, suffix: '/ 10 free' },
                  { label: 'Practice Sessions',  value: stats?.practiceSessions ?? 0, max: 20, suffix: 'done' },
                  { label: 'AI Conversations',   value: stats?.conversations ?? 0, max: 50, suffix: 'total' },
                ].map(({ label, value, max, suffix }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-500">{loading ? '…' : value} {suffix}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${Math.min((Number(value) / max) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ai-disclaimer mt-6">
          <strong>ℹ️ Important:</strong> BuiltIt AI generates AI-derived logical construction sequences.
          These do <strong>not</strong> represent the actual historical drawing order from the original image.
        </div>
      </div>
    </AppShell>
  );
}
