'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

const PERKS = [
  '10 diagram uploads included free',
  'Full AI analysis and construction sequences',
  'All 4 practice modes',
  'PNG, SVG, PDF, Mermaid, MP4 exports',
  'AI Teacher access',
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error: err } = await signup(name, email, password, confirmPassword);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    toast.success('Account created! Welcome to BuiltIt AI.');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-scale-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
          ← Back to home
        </Link>

        <div className="card glass" style={{ padding: '2rem' }}>
          <div className="text-center mb-7">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 no-underline">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
                <span className="text-white font-black text-base">B</span>
              </div>
              <span className="text-white font-bold text-lg">BuiltIt AI</span>
            </Link>
            <h1 className="text-white font-bold text-2xl">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1.5">Start analyzing and building for free</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="signup-name">Full name</label>
              <input id="signup-name" type="text" className="input" placeholder="Jane Smith"
                required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="label" htmlFor="signup-email">Email address</label>
              <input id="signup-email" type="email" className="input" placeholder="you@example.com"
                required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="label" htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" className="input" placeholder="Min. 8 characters"
                required value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="field-hint">Must include uppercase letter and a number.</p>
            </div>

            <div>
              <label className="label" htmlFor="signup-confirm">Confirm password</label>
              <input id="signup-confirm" type="password" className="input" placeholder="Re-enter your password"
                required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {/* Free plan perks */}
            <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-4 py-3">
              <p className="text-xs text-emerald-400 font-semibold mb-2">✓ Free Plan Includes</p>
              <ul className="space-y-1">
                {PERKS.map((p) => (
                  <li key={p} className="text-xs text-emerald-300/80 flex items-start gap-1.5">
                    <span className="text-emerald-500 flex-shrink-0 mt-px">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              id="signup-submit-btn"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          By creating an account, you agree to our{' '}
          <a href="#" className="hover:text-slate-400 transition-colors">Terms</a> and{' '}
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
