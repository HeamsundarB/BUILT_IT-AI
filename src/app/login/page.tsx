'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await login(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    toast.success('Welcome back!');
    const from = params.get('from') ?? '/dashboard';
    router.push(from);
  }

  function fillDemo() {
    setEmail('demo@builtitai.com');
    setPassword('demo1234');
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
          ← Back to home
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 no-underline">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <span className="text-white font-black text-base">B</span>
            </div>
            <span className="text-white font-bold text-lg">BuiltIt AI</span>
          </Link>
          <h1 className="text-white font-bold text-2xl">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1.5">Sign in to continue building</p>
        </div>

        <div className="card glass" style={{ padding: '2rem' }}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label" style={{ marginBottom: 0 }} htmlFor="login-password">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="divider my-5" />

          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-lg bg-indigo-500/8 border border-indigo-500/20 px-4 py-3 text-xs text-indigo-300 hover:bg-indigo-500/12 transition-colors text-left"
          >
            <strong>Demo credentials:</strong> demo@builtitai.com / demo1234 — <span className="underline">Click to fill</span>
          </button>

          <p className="text-center text-sm text-slate-400 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          By signing in you agree to our{' '}
          <a href="#" className="hover:text-slate-400 transition-colors">Terms</a> and{' '}
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
