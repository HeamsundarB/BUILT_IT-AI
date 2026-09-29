import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { userQueries, verifyPassword } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = userQueries.findByEmail(email.trim().toLowerCase());
    if (!user || !user.password_hash || !user.salt) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = verifyPassword(password, user.password_hash, user.salt);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    await session.save();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        settings: JSON.parse(user.settings),
        subscription: JSON.parse(user.subscription),
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
