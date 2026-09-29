import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { userQueries, getDashboardStats, projectQueries, conversationQueries, practiceQueries } from '@/lib/db';

// GET /api/user/me — current user profile
export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = userQueries.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      settings: JSON.parse(user.settings),
      subscription: JSON.parse(user.subscription),
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error('[/api/user/me]', err);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH /api/user/me — update profile / settings
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const updateData: Parameters<typeof userQueries.update>[1] = {};

    if (body.name)     updateData.name     = String(body.name).trim();
    if (body.settings) updateData.settings = JSON.stringify(body.settings);

    userQueries.update(session.userId, updateData);

    const updated = userQueries.findById(session.userId)!;
    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      settings: JSON.parse(updated.settings),
      subscription: JSON.parse(updated.subscription),
    });
  } catch (err) {
    console.error('[PATCH /api/user/me]', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
