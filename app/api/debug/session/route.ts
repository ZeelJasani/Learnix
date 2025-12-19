import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

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

  const candidates = ['session', 'better-auth.session', 'better-auth.session_token'];
  for (const key of candidates) {
    const token = cookieMap.get(key);
    if (!token) continue;
    result[key] = { present: true };
  }

  // Ask server auth for the session instead of decoding cookie
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    result.session = session ?? null;
  } catch (e) {
    result.session_error = e instanceof Error ? e.message : 'unknown';
  }

  return NextResponse.json(result);
}


