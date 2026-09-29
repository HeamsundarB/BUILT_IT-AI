'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';
import { useAuth } from '@/components/providers/AuthProvider';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
      { href: '/upload',    icon: '⬆', label: 'New Upload' },
      { href: '/workspace', icon: '⬡', label: 'Analysis' },
      { href: '/practice',  icon: '◎', label: 'Practice' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/history',  icon: '◷', label: 'History' },
      { href: '/settings', icon: '⚙', label: 'Settings' },
      { href: '/help',     icon: '?', label: 'Help & Docs' },
    ],
  },
] as const;

export function Sidebar() {
  const pathname      = usePathname();
  const router        = useRouter();
  const sidebarOpen   = useUIStore((s) => s.sidebar);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    toast.success('Signed out');
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full flex flex-col',
          'w-60 border-r border-white/[0.07]',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:translate-x-0 lg:flex'
        )}
        style={{ background: '#131929' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.07] flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/25 flex-shrink-0">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm leading-none tracking-tight">BuiltIt AI</div>
              <div className="text-[10px] text-indigo-400/70 mt-0.5 leading-none">Upload. Analyze. Build.</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="nav-section-label">{group.label}</div>
              <div className="space-y-0.5">
                {group.items.map(({ href, icon, label }) => {
                  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn('nav-link', active && 'nav-link-active')}
                    >
                      <span className="w-5 text-center text-sm leading-none flex-shrink-0 opacity-70">{icon}</span>
                      <span className="flex-1 text-[0.8125rem]">{label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick action */}
        <div className="px-2.5 py-3 border-t border-white/[0.07]">
          <Link
            href="/upload"
            className="btn btn-primary w-full btn-sm"
            style={{ borderRadius: '0.625rem', fontSize: '0.8rem' }}
          >
            + New Analysis
          </Link>
        </div>

        {/* User profile */}
        <div className="px-2.5 pb-3 relative">
          {user ? (
            <>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-white text-xs font-medium truncate">{user.name}</div>
                  <div className="text-slate-500 text-[10px] truncate">{user.email}</div>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0">⋯</span>
              </button>

              {/* User menu */}
              {showUserMenu && (
                <div className="absolute bottom-full left-2.5 right-2.5 mb-1 rounded-xl border border-white/[0.1] bg-[#1a2236] shadow-xl overflow-hidden z-50">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] transition-colors"
                  >
                    ⚙ Settings
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] transition-colors"
                  >
                    ◷ History
                  </Link>
                  <div className="border-t border-white/[0.07]" />
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {loggingOut ? '...' : '↩ Sign Out'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">?</div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-400 text-xs font-medium">Not signed in</div>
                <Link href="/login" className="text-indigo-400 text-[10px] hover:text-indigo-300 transition-colors">Sign in →</Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
