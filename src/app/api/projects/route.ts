import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { projectQueries } from '@/lib/db';

// GET /api/projects
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const search = req.nextUrl.searchParams.get('search') ?? undefined;
    const projects = projectQueries.list(session.userId, search);
    return NextResponse.json({ projects });
  } catch (err) {
    console.error('[GET /api/projects]', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { name, description } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });

    const project = projectQueries.create(session.userId, name.trim(), description?.trim());
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/projects]', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
