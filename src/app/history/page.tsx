'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';
import { timeAgo, truncate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ConvRow {
  id: string;
  title: string;
  is_pinned: number;
  updated_at: string;
  message_count?: number;
  last_message?: string;
}

type Tab = 'all' | 'pinned' | 'recent';

export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('all');

  // Inline edit state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const url = q ? `/api/conversations?search=${encodeURIComponent(q)}` : '/api/conversations';
      const res = await fetch(url);
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  async function handlePin(id: string, currentPinned: boolean) {
    const res = await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !currentPinned }),
    });
    if (res.ok) {
      setConversations((prev) => prev.map((c) =>
        c.id === id ? { ...c, is_pinned: currentPinned ? 0 : 1 } : c
      ));
      toast.success(currentPinned ? 'Unpinned' : 'Pinned');
    }
    setMenuOpenId(null);
  }

  async function handleRename(id: string) {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    const res = await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: renameValue.trim() }),
    });
    if (res.ok) {
      setConversations((prev) => prev.map((c) =>
        c.id === id ? { ...c, title: renameValue.trim() } : c
      ));
      toast.success('Renamed');
    }
    setRenamingId(null);
    setRenameValue('');
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      toast.success('Deleted');
    } else {
      toast.error('Delete failed');
    }
    setMenuOpenId(null);
  }

  const filtered = conversations.filter((c) => {
    if (tab === 'pinned') return c.is_pinned === 1;
    if (tab === 'recent') return c.is_pinned === 0;
    return true;
  });

  const pinned = conversations.filter((c) => c.is_pinned === 1);
  const unpinned = conversations.filter((c) => c.is_pinned === 0);

  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        {/* Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="page-title">History</h1>
            <p className="page-subtitle">Past AI chats, analyses, and practice sessions.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="search"
              className="input"
              placeholder="Search conversations..."
              style={{ width: '220px', padding: '0.4rem 0.75rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-white/[0.04] border border-white/[0.07] w-fit">
          {(['all', 'pinned', 'recent'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                tab === t
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {t} {t === 'pinned' ? `(${pinned.length})` : t === 'all' ? `(${conversations.length})` : `(${unpinned.length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Conversation list */}
          <div className="lg:col-span-2 space-y-3">

            {/* Pinned section */}
            {tab !== 'recent' && pinned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-medium uppercase tracking-wide">
                  <span>📌</span> Pinned Chats
                </div>
                <div className="space-y-2">
                  {pinned.map((c) => (
                    <ConvItem
                      key={c.id} conv={c}
                      renamingId={renamingId} renameValue={renameValue}
                      menuOpenId={menuOpenId}
                      onRenameStart={() => { setRenamingId(c.id); setRenameValue(c.title); setMenuOpenId(null); }}
                      onRenameChange={setRenameValue}
                      onRenameSubmit={() => handleRename(c.id)}
                      onRenameCancel={() => { setRenamingId(null); setRenameValue(''); }}
                      onPin={() => handlePin(c.id, true)}
                      onDelete={() => handleDelete(c.id)}
                      onMenuToggle={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All/recent chats */}
            <div>
              {tab === 'all' && pinned.length > 0 && unpinned.length > 0 && (
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-medium uppercase tracking-wide">
                  <span>💬</span> Recent Chats
                </div>
              )}
              {loading ? (
                <div className="space-y-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
                  ))}
                </div>
              ) : filtered.filter((c) => !(tab === 'all' && c.is_pinned === 1)).length > 0 ? (
                <div className="space-y-2">
                  {filtered
                    .filter((c) => !(tab === 'all' && c.is_pinned === 1))
                    .map((c) => (
                      <ConvItem
                        key={c.id} conv={c}
                        renamingId={renamingId} renameValue={renameValue}
                        menuOpenId={menuOpenId}
                        onRenameStart={() => { setRenamingId(c.id); setRenameValue(c.title); setMenuOpenId(null); }}
                        onRenameChange={setRenameValue}
                        onRenameSubmit={() => handleRename(c.id)}
                        onRenameCancel={() => { setRenamingId(null); setRenameValue(''); }}
                        onPin={() => handlePin(c.id, false)}
                        onDelete={() => handleDelete(c.id)}
                        onMenuToggle={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="card flex flex-col items-center justify-center py-14 text-center">
                  <div className="text-5xl mb-4 opacity-25">💬</div>
                  <h3 className="text-white font-semibold mb-2">
                    {search ? 'No results found' : 'No conversations yet'}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-4">
                    {search
                      ? `No conversations matching "${search}".`
                      : 'Analyze a diagram and ask the AI Teacher to start your first conversation.'}
                  </p>
                  <Link href="/upload" className="btn btn-primary btn-sm">Start First Analysis</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="card">
              <h2 className="section-title mb-4">Activity Summary</h2>
              <div className="space-y-3">
                {[
                  { icon: '💬', label: 'Total Conversations', value: conversations.length },
                  { icon: '📌', label: 'Pinned',              value: pinned.length },
                  { icon: '💡', label: 'With Messages',       value: conversations.filter((c) => (c.message_count ?? 0) > 0).length },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="flex-1 text-sm text-slate-400">{label}</span>
                    <span className="text-white font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card">
              <h2 className="section-title mb-3">Chat History Tips</h2>
              <div className="space-y-2.5 text-xs text-slate-400">
                {[
                  { icon: '📌', tip: 'Pin important conversations for quick access at the top' },
                  { icon: '✏️', tip: 'Rename any chat to something descriptive' },
                  { icon: '🔍', tip: 'Search across all conversation titles and message content' },
                  { icon: '🗑️', tip: 'Delete conversations you no longer need' },
                ].map(({ icon, tip }) => (
                  <div key={tip} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">{icon}</span>
                    <p className="leading-relaxed">{tip}</p>
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

// ---------------------------------------------------------------------------
// Conversation item component
// ---------------------------------------------------------------------------

function ConvItem({
  conv, renamingId, renameValue, menuOpenId,
  onRenameStart, onRenameChange, onRenameSubmit, onRenameCancel,
  onPin, onDelete, onMenuToggle,
}: {
  conv: ConvRow;
  renamingId: string | null;
  renameValue: string;
  menuOpenId: string | null;
  onRenameStart: () => void;
  onRenameChange: (v: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onPin: () => void;
  onDelete: () => void;
  onMenuToggle: () => void;
}) {
  const isRenaming = renamingId === conv.id;
  const menuOpen   = menuOpenId === conv.id;

  return (
    <div className="relative flex items-start gap-3 px-3 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.1] transition-all group">
      <div className="text-lg flex-shrink-0 mt-0.5">{conv.is_pinned ? '📌' : '💬'}</div>

      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              className="input text-sm flex-1"
              style={{ padding: '0.25rem 0.5rem', height: 'auto' }}
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') onRenameCancel(); }}
            />
            <button onClick={onRenameSubmit} className="btn btn-primary btn-xs">✓</button>
            <button onClick={onRenameCancel} className="btn btn-ghost btn-xs">✕</button>
          </div>
        ) : (
          <div className="text-white text-sm font-medium truncate">{conv.title}</div>
        )}

        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
          {(conv.message_count ?? 0) > 0 && (
            <span className="badge badge-gray text-[9px]">{conv.message_count} msg</span>
          )}
          {conv.last_message && (
            <span className="truncate max-w-[140px]">{truncate(conv.last_message, 40)}</span>
          )}
          <span className="flex-shrink-0">{timeAgo(conv.updated_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onMenuToggle}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all text-xs"
          aria-label="More options"
        >
          ⋯
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-3 top-10 z-20 rounded-xl border border-white/[0.1] bg-[#1a2236] shadow-xl overflow-hidden w-36">
          <button
            onClick={() => { onRenameStart(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06] transition-colors"
          >
            ✏️ Rename
          </button>
          <button
            onClick={onPin}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06] transition-colors"
          >
            {conv.is_pinned ? '📌 Unpin' : '📌 Pin'}
          </button>
          <div className="border-t border-white/[0.07]" />
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
