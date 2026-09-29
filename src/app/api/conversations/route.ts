import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { conversationQueries, messageQueries } from '@/lib/db';

// GET /api/conversations?search=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const search = req.nextUrl.searchParams.get('search') ?? undefined;
    const conversations = conversationQueries.list(session.userId, search);
    return NextResponse.json({ conversations });
  } catch (err) {
    console.error('[GET /api/conversations]', err);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/conversations — create new conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { title, projectId } = await req.json();
    const conv = conversationQueries.create(session.userId, title ?? 'New Chat', projectId);
    return NextResponse.json({ conversation: conv }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/conversations]', err);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
