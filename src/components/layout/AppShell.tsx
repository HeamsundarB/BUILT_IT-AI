'use client';

import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

// Map pathnames to readable page titles
const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/upload':     'New Upload',
  '/workspace':  'Analysis Workspace',
  '/practice':   'Practice',
  '/history':    'History',
  '/settings':   'Settings',
  '/help':       'Help & Docs',
};

export function AppShell({ children, header }: AppShellProps) {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebar);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const pageTitle = Object.entries(PAGE_TITLES).find(([k]) =>
    pathname === k || pathname.startsWith(k + '/')
  )?.[1] ?? 'BuiltIt AI';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 h-13 flex items-center gap-3 px-4 sm:px-5 border-b border-white/[0.07] bg-[#0f1117]/90 backdrop-blur-sm sticky top-0 z-10"
          style={{ height: '3.25rem' }}
        >
          {/* Hamburger / sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="btn-icon flex-shrink-0"
            aria-label="Toggle sidebar"
            id="sidebar-toggle-btn"
          >
            <div className="space-y-1.5">
              <span className={cn('block h-[1.5px] w-4.5 bg-slate-400 transition-all origin-center',
                sidebarOpen && 'rotate-45 translate-y-[7px]'
              )} style={{ width: '1.125rem' }} />
              <span className={cn('block h-[1.5px] bg-slate-400 transition-all',
                sidebarOpen ? 'opacity-0 w-0' : 'w-[1.125rem]'
              )} />
              <span className={cn('block h-[1.5px] w-4.5 bg-slate-400 transition-all origin-center',
                sidebarOpen && '-rotate-45 -translate-y-[7px]'
              )} style={{ width: '1.125rem' }} />
            </div>
          </button>

          {/* Page title or custom header */}
          {header ? (
            <div className="flex-1 min-w-0">{header}</div>
          ) : (
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-semibold">{pageTitle}</span>
            </div>
          )}

          {/* Right-side controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* AI status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
              <span className="text-indigo-300 text-[11px] font-medium hidden sm:block">AI Ready</span>
            </div>

            {/* Quick upload shortcut */}
            <Link href="/upload" className="btn btn-primary btn-sm hidden sm:flex">
              + Upload
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
