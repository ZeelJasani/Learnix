import { NextRequest } from 'next/server';

export function getSession(request: NextRequest) {
  // Get the session cookie directly without importing the entire better-auth package
  const cookie = request.cookies.get('session');
  if (!cookie?.value) return null;
  
  try {
    // Parse the JWT payload (middle section between the dots)
    const base64Url = cookie.value.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    return payload;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}