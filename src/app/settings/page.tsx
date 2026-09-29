'use client';

import { useEffect, useState, FormEvent } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SETTINGS_SECTIONS = ['Account', 'Appearance', 'AI & Analysis', 'Voice', 'Export', 'Privacy', 'Danger Zone'];

export default function SettingsPage() {
  const { user, refresh, logout } = useAuth();
  const router = useRouter();

  const [name, setName]   = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Settings toggles
  const [autoAnalyze,   setAutoAnalyze]   = useState(true);
  const [confidence,    setConfidence]    = useState(false);
  const [suggestions,   setSuggestions]   = useState(true);
  const [voiceEnabled,  setVoiceEnabled]  = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [analytics,     setAnalytics]     = useState(true);
  const [saveHistory,   setSaveHistory]   = useState(true);
  const [aiImprove,     setAiImprove]     = useState(false);
  const [reduceMotion,  setReduceMotion]  = useState(false);
  const [exportFormat,  setExportFormat]  = useState('png');
  const [theme,         setTheme]         = useState('dark');

  // Populate from user
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    const s = user.settings as Record<string, unknown>;
    if (s.voiceEnabled !== undefined) setVoiceEnabled(Boolean(s.voiceEnabled));
    if (s.defaultExportFormat) setExportFormat(String(s.defaultExportFormat));
    if (s.theme) setTheme(String(s.theme));
  }, [user]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          settings: {
            ...((user?.settings as Record<string, unknown>) ?? {}),
            theme,
            voiceEnabled,
            defaultExportFormat: exportFormat,
          },
        }),
      });
      if (res.ok) {
        await refresh();
        toast.success('Settings saved');
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Delete your account permanently? All your data will be lost. This CANNOT be undone.')) return;
    setDeleting(true);
    await logout();
    toast.success('Account deleted');
    router.push('/');
  }

  return (
    <AppShell>
      <div className="page-container animate-fade-in">

        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and configure preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5">

          {/* Nav */}
          <div className="lg:sticky lg:top-16 self-start space-y-0.5">
            {SETTINGS_SECTIONS.map((item) => (
              <a
                key={item}
                href={`#settings-${item.toLowerCase().replace(/[& ]+/g, '-').replace(/--/g, '-')}`}
                className="nav-link text-sm"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Content */}
          <form onSubmit={handleSave} className="space-y-5 min-w-0">

            {/* Account */}
            <div className="card" id="settings-account">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">Account</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="text-white font-medium text-sm mb-1">{user?.email}</div>
                  <span className="badge badge-indigo capitalize">{((user?.subscription as Record<string, unknown>)?.plan as string) ?? 'free'} plan</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="settings-name">Display Name</label>
                  <input id="settings-name" type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" value={user?.email ?? ''} disabled readOnly />
                  <p className="field-hint">Email cannot be changed.</p>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="card" id="settings-appearance">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[['dark','🌙 Dark'], ['light','☀️ Light'], ['system','💻 System']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setTheme(v)}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                          theme === v
                            ? 'border-indigo-500/40 bg-indigo-600/15 text-indigo-300'
                            : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:text-white'
                        }`}>{l}</button>
                    ))}
                  </div>
                </div>
                <ToggleRow id="toggle-reduce-motion" label="Reduce motion" desc="Minimize UI animations" value={reduceMotion} onChange={setReduceMotion} />
              </div>
            </div>

            {/* AI & Analysis */}
            <div className="card" id="settings-ai---analysis">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">AI & Analysis</h2>
              <div className="space-y-4">
                <ToggleRow id="toggle-auto-analyze" label="Auto-Analyze on Upload" desc="Immediately start AI analysis after file upload" value={autoAnalyze} onChange={setAutoAnalyze} />
                <ToggleRow id="toggle-confidence" label="Show AI Confidence Scores" desc="Display percentage confidence for each detected element" value={confidence} onChange={setConfidence} />
                <ToggleRow id="toggle-suggestions" label="AI Teacher Auto-Suggestions" desc="Show contextual suggestions while viewing construction steps" value={suggestions} onChange={setSuggestions} />
                <div>
                  <label className="label" htmlFor="settings-default-type">Default Diagram Type Hint</label>
                  <select id="settings-default-type" className="input max-w-xs">
                    {['Auto-detect', 'Flowchart', 'UML Class', 'ER Diagram', 'Architecture', 'Mind Map'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Voice */}
            <div className="card" id="settings-voice">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">Voice Guidance</h2>
              <div className="space-y-4">
                <ToggleRow id="toggle-voice" label="Enable Voice Guidance" desc="Read construction steps aloud during practice" value={voiceEnabled} onChange={setVoiceEnabled} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="settings-voice-lang">Voice Language</label>
                    <select id="settings-voice-lang" className="input" disabled={!voiceEnabled}>
                      {['English (US)', 'English (UK)', 'Spanish', 'French', 'German'].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="settings-voice-speed">Playback Speed</label>
                    <select id="settings-voice-speed" className="input" disabled={!voiceEnabled}>
                      {['0.75×', '1.0× (Normal)', '1.25×', '1.5×', '2.0×'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Export */}
            <div className="card" id="settings-export">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">Export Preferences</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="settings-export-format">Default Export Format</label>
                    <select id="settings-export-format" className="input" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                      {['png', 'svg', 'pdf', 'json', 'mermaid', 'plantuml', 'mp4'].map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="settings-export-quality">Image Quality</label>
                    <select id="settings-export-quality" className="input">
                      {['High (2×)', 'Standard (1×)', 'Low (0.5×)'].map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
                <ToggleRow id="toggle-metadata" label="Include Metadata" desc="Embed analysis data in exported files" value={includeMetadata} onChange={setIncludeMetadata} />
              </div>
            </div>

            {/* Privacy */}
            <div className="card" id="settings-privacy">
              <h2 className="section-title mb-5 pb-4 border-b border-white/[0.07]">Privacy</h2>
              <div className="space-y-4">
                <ToggleRow id="toggle-analytics"   label="Usage Analytics"            desc="Help improve BuiltIt AI with anonymous usage data"         value={analytics}   onChange={setAnalytics} />
                <ToggleRow id="toggle-history"     label="Save Analysis History"      desc="Store past analyses and practice sessions"                 value={saveHistory} onChange={setSaveHistory} />
                <ToggleRow id="toggle-ai-improve"  label="Contribute to AI Improvement" desc="Allow anonymized diagram data for model training"       value={aiImprove}   onChange={setAiImprove} />
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-3">
              <button id="settings-save-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
              <button id="settings-cancel-btn" type="button" className="btn btn-secondary btn-lg" onClick={() => window.location.reload()}>
                Discard
              </button>
            </div>

            {/* Danger zone */}
            <div className="card" id="settings-danger-zone" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
              <h2 className="text-red-400 font-semibold mb-4 pb-4 border-b" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
                ⚠ Danger Zone
              </h2>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white font-medium">Delete Account</div>
                  <div className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all data. Cannot be undone.</div>
                </div>
                <button
                  type="button"
                  id="settings-delete-btn"
                  className="btn btn-danger btn-sm flex-shrink-0"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Reusable toggle row
// ---------------------------------------------------------------------------

function ToggleRow({ id, label, desc, value, onChange }: {
  id: string; label: string; desc: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white font-medium">{label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
        </div>
        <button
          type="button"
          id={id}
          onClick={() => onChange(!value)}
          className={`toggle-track ${value ? 'active' : ''}`}
        >
          <div className="toggle-thumb" />
        </button>
      </div>
      <hr className="divider" />
    </>
  );
}
