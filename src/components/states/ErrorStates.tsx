'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { getErrorMessage } from '@/lib/errors';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  error,
  onRetry,
  action,
  className,
  size = 'md',
}: ErrorStateProps) {
  const errorMsg = error ? getErrorMessage(error) : description;

  const sizeStyles = {
    sm: { container: 'py-8 gap-3', icon: 'h-10 w-10 text-lg', title: 'text-sm', desc: 'text-xs' },
    md: { container: 'py-16 gap-5', icon: 'h-14 w-14 text-2xl', title: 'text-base', desc: 'text-sm' },
    lg: { container: 'py-24 gap-6', icon: 'h-20 w-20 text-3xl', title: 'text-xl', desc: 'text-base' },
  };
  const s = sizeStyles[size];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', s.container, className)}>
      {/* Error icon */}
      <div className={cn('rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0', s.icon)}>
        <span>⚠️</span>
      </div>

      <div className="max-w-sm">
        <h3 className={cn('font-semibold text-white mb-1.5', s.title)}>{title}</h3>
        {errorMsg && (
          <p className={cn('text-gray-400 leading-relaxed', s.desc)}>{errorMsg}</p>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try again
          </button>
        )}
        {action}
      </div>
    </div>
  );
}

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-8">
      <div className="max-w-md w-full rounded-2xl bg-white/5 border border-red-500/20 p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        <h1 className="text-white font-bold text-xl mb-2">Application Error</h1>
        <p className="text-gray-400 text-sm mb-1">An unexpected error occurred:</p>
        <code className="block text-red-400 text-xs bg-red-500/10 rounded p-3 my-4 font-mono text-left break-all">
          {error.message}
        </code>
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
          >
            Reload Application
          </button>
        )}
      </div>
    </div>
  );
}

export function NotFoundState({
  resource = 'Page',
  onBack,
}: {
  resource?: string;
  onBack?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        <div className="text-8xl font-black text-violet-500/20 mb-4 select-none">404</div>
        <h1 className="text-white font-bold text-2xl mb-2">{resource} not found</h1>
        <p className="text-gray-400 text-sm mb-8">
          The {resource.toLowerCase()} you're looking for doesn't exist or has been removed.
        </p>
        {onBack ? (
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go back
          </button>
        ) : (
          <a
            href="/dashboard"
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors inline-block"
          >
            Go to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}
