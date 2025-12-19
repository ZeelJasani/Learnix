import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/dashboard/:path*'],
};

// Simple session presence check (tokens may be opaque, don't decode)
function hasSessionCookie(request: NextRequest) {
  // Try common cookie keys used by auth libraries
  const possibleCookieKeys = ['session', 'better-auth.session', 'better-auth.session_token'];

  // First try the NextRequest cookies API (works in most cases)
  for (const key of possibleCookieKeys) {
    if (!!request.cookies.get(key)?.value) return true;
  }

  // Fallback: inspect the raw Cookie header. Some cookie names include
  // dots or are URL-encoded which can make them miss in the cookies API
  // in certain edge/runtime environments. This simple substring check
  // helps detect those cases without decoding the cookie value.
  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader) return false;

  for (const key of possibleCookieKeys) {
    // plain and URL-encoded variants
    if (cookieHeader.includes(`${key}=`)) return true;
    const encoded = encodeURIComponent(key);
    if (encoded !== key && cookieHeader.includes(`${encoded}=`)) return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and public routes
  if (pathname.startsWith('/_next/static') || 
      pathname.startsWith('/api/public') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Avoid running middleware's security fetch for the security route itself
  // to prevent recursive middleware -> API -> middleware loops.
  if (pathname === '/api/security') {
    return NextResponse.next();
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const hasSession = hasSessionCookie(request);
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Dashboard route protection
  if (pathname.startsWith('/dashboard')) {
    const hasSession = hasSessionCookie(request);
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Skip security checks in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // For API and admin routes in production, verify security
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin')) {
    try {
      // Call our API route for security checks
      const securityUrl = new URL('/api/security', request.url);
      const securityCheck = await fetch(securityUrl.toString(), {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify({}),
      });
      
      const { allowed } = await securityCheck.json();
      if (!allowed) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    } catch (error) {
      console.error('Security check failed:', error);
      // Fail open in case of errors
    }
  }

  return NextResponse.next();
}