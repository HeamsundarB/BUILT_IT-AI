'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-violet-500/30 border-t-violet-500',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

interface LoadingPageProps {
  message?: string;
  submessage?: string;
}

export function LoadingPage({ message = 'Loading...', submessage }: LoadingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a12]">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Animated logo mark */}
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-violet-500/20 animate-ping" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{message}</p>
          {submessage && <p className="text-gray-400 text-sm mt-1">{submessage}</p>}
        </div>
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({ message, className }: LoadingCardProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16', className)}>
      <LoadingSpinner size="lg" />
      {message && <p className="text-gray-400 text-sm animate-pulse">{message}</p>}
    </div>
  );
}

export function LoadingRow() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-48 bg-white/10 rounded" />
        <div className="h-2 w-32 bg-white/10 rounded" />
      </div>
      <div className="h-6 w-16 bg-white/10 rounded-full" />
    </div>
  );
}

export function LoadingSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 animate-pulse">
          <div className="h-32 w-full rounded-lg bg-white/10" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
          <div className="h-3 w-1/2 bg-white/10 rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-white/10 rounded-full" />
            <div className="h-5 w-20 bg-white/10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface AIProcessingProps {
  stage?: string;
  progress?: number;
}

export function AIProcessingState({ stage = 'Analyzing diagram...', progress }: AIProcessingProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 px-8 text-center">
      {/* Animated AI orb */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-violet-500/40">
          <span className="text-white text-3xl">✦</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping" />
        <div className="absolute -inset-2 rounded-full bg-purple-500/15 animate-ping [animation-delay:0.3s]" />
      </div>

      <div>
        <p className="text-white font-semibold text-lg mb-1">{stage}</p>
        <p className="text-gray-400 text-sm">
          Generating AI-derived logical construction sequence
        </p>
        <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
          This does not recover the original drawing order
        </p>
      </div>

      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
