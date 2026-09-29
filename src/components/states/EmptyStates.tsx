'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string | ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { container: 'py-8', icon: 'text-3xl', title: 'text-base', desc: 'text-xs' },
  md: { container: 'py-16', icon: 'text-5xl', title: 'text-lg', desc: 'text-sm' },
  lg: { container: 'py-24', icon: 'text-7xl', title: 'text-2xl', desc: 'text-base' },
};

export function EmptyState({
  icon = '📂',
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const s = sizeStyles[size];
  return (
    <div className={cn('flex flex-col items-center justify-center text-center gap-4', s.container, className)}>
      <div className="relative">
        <div className={cn('opacity-50', s.icon)}>
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
        <div className="absolute inset-0 blur-2xl opacity-20 bg-violet-500 rounded-full" />
      </div>
      <div className="max-w-sm">
        <h3 className={cn('font-semibold text-white mb-2', s.title)}>{title}</h3>
        {description && (
          <p className={cn('text-gray-400 leading-relaxed', s.desc)}>{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function EmptyProjects({ onNew }: { onNew?: () => void }) {
  return (
    <EmptyState
      icon="🗂️"
      title="No projects yet"
      description="Upload your first diagram image to get started. BUILTIT AI will analyze it and generate an AI-derived construction sequence."
      action={
        onNew && (
          <button
            onClick={onNew}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Create First Project
          </button>
        )
      }
    />
  );
}

export function EmptyAnalysis() {
  return (
    <EmptyState
      icon="🔬"
      title="No analysis yet"
      description="Upload a diagram image and click Analyze to generate an AI-derived logical construction sequence."
      size="md"
    />
  );
}

export function EmptyHistory() {
  return (
    <EmptyState
      icon="📋"
      title="No history yet"
      description="Your past analyses and practice sessions will appear here."
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      title={`No results for "${query}"`}
      description="Try different keywords or check your spelling."
      size="sm"
    />
  );
}

export function EmptyPractice() {
  return (
    <EmptyState
      icon="🎯"
      title="No practice sessions"
      description="Analyze a diagram first, then start a practice session to test your reconstruction skills."
    />
  );
}
