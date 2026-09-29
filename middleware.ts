// =============================================================================
// BUILTIT AI — Route Protection Middleware
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { SessionData, SESSION_OPTIONS } from '@/lib/session';
import { getIronSession } from 'iron-session';

// Routes that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/upload',
  '/workspace',
  '/practice',
  '/history',
  '/settings',
  '/help',
  '/api/user',
  '/api/projects',
  '/api/conversations',
  '/api/practice',
  '/api/analyses',
];

// Routes only for guests (redirect to dashboard if logged in)
const GUEST_ONLY = ['/login', '/signup'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read session from cookie — iron-session needs req+res pair
  const res = NextResponse.next();
  // Decode session by reading the raw cookie value directly
  const rawCookie = req.cookies.get(SESSION_OPTIONS.cookieName as string)?.value;
  const isLoggedIn = Boolean(rawCookie && rawCookie.length > 10);

  // Redirect unauthenticated users away from protected pages
  if (isProtected(pathname) && !isLoggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup
  if (isGuestOnly(pathname) && isLoggedIn) {
    const dashUrl = req.nextUrl.clone();
    dashUrl.pathname = '/dashboard';
    dashUrl.searchParams.delete('from');
    return NextResponse.redirect(dashUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/upload/:path*',
    '/workspace/:path*',
    '/practice/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/help/:path*',
    '/login',
    '/signup',
    '/api/user/:path*',
    '/api/projects/:path*',
    '/api/conversations/:path*',
    '/api/practice/:path*',
    '/api/analyses/:path*',
  ],
};
