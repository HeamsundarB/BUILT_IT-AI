import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDashboardStats, projectQueries, conversationQueries, practiceQueries } from '@/lib/db';

// GET /api/user/stats — dashboard stats + recent items
export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.userId;
    const stats   = getDashboardStats(userId);
    const recentProjects      = projectQueries.list(userId).slice(0, 5);
    const recentConversations = conversationQueries.list(userId).slice(0, 5);
    const recentPractice      = practiceQueries.list(userId).slice(0, 5);

    return NextResponse.json({
      stats,
      recentProjects,
      recentConversations,
      recentPractice,
    });
  } catch (err) {
    console.error('[/api/user/stats]', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
