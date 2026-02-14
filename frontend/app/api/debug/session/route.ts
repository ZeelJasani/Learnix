// Aa file session cookies ane Clerk auth state debug karva mate API route provide kare chhe
// This file provides a debug API route to inspect session cookies and Clerk auth state
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  const result: Record<string, unknown> = { cookies: cookies.split(';').map((c) => c.trim()) };

  // Try to parse likely session cookies
  const cookieMap = new Map(
    cookies
      .split(';')
      .map((c) => c.trim())
      .map((c) => {
        const [k, ...rest] = c.split('=');
        return [k, rest.join('=')];
      })
  );

  const candidates = ['session', 'better-auth.session', 'better-auth.session_token', '__session', '__clerk_db_jwt'];
  for (const key of candidates) {
    const token = cookieMap.get(key);
    if (!token) continue;
    result[key] = { present: true };
  }

  // Ask Clerk for auth state
  try {
    const { userId, sessionId } = await auth();
    result.clerk = { userId: userId ?? null, sessionId: sessionId ?? null };
  } catch (e) {
    result.session_error = e instanceof Error ? e.message : 'unknown';
  }

  return NextResponse.json(result);
}


