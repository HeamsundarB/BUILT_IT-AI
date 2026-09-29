// =============================================================================
// BUILTIT AI — Iron-Session config (server-only)
// =============================================================================

import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
}

export const SESSION_OPTIONS: SessionOptions = {
  password: process.env.SESSION_SECRET ?? 'builtit-ai-secret-key-change-in-production-min-32-chars',
  cookieName: 'builtit_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error('UNAUTHORIZED');
  }
  return { userId: session.userId as string, email: session.email as string, name: session.name as string };
}
