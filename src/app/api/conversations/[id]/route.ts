import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { conversationQueries, messageQueries } from '@/lib/db';

// GET /api/conversations/[id] — fetch conversation + messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const conv = conversationQueries.findById(id, session.userId);
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const messages = messageQueries.list(id);
    return NextResponse.json({ conversation: conv, messages });
  } catch (err) {
    console.error('[GET /api/conversations/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

// PATCH /api/conversations/[id] — rename / pin / unpin
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const conv = conversationQueries.findById(id, session.userId);
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();

    if (typeof body.title === 'string' && body.title.trim()) {
      conversationQueries.rename(id, session.userId, body.title.trim());
    }
    if (typeof body.pinned === 'boolean') {
      conversationQueries.setPinned(id, session.userId, body.pinned);
    }

    const updated = conversationQueries.findById(id, session.userId);
    return NextResponse.json({ conversation: updated });
  } catch (err) {
    console.error('[PATCH /api/conversations/[id]]', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/conversations/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const conv = conversationQueries.findById(id, session.userId);
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    conversationQueries.delete(id, session.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/conversations/[id]]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
