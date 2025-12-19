import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Lightweight bot detection for common bots
const ALLOWED_BOTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot',
  'baiduspider', 'yandexbot', 'facebot', 'ia_archiver'
] as const;

function isBotAllowed(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return ALLOWED_BOTS.some((bot: string) => ua.includes(bot));
}

export async function POST(request: NextRequest) {
  const userAgent = (await headers()).get('user-agent');
  
  // Skip for allowed bots
  if (isBotAllowed(userAgent)) {
    return NextResponse.json({ allowed: true });
  }

  // Only load ArcJet if absolutely necessary
  try {
    const { detectBot } = await import('@arcjet/next');
    const arcjet = (await import('@arcjet/next')).default;

    const aj = arcjet({
      key: process.env.ARCJET_KEY!,
      rules: [
        detectBot({
          mode: 'LIVE',
          allow: [
            'CATEGORY:SEARCH_ENGINE',
            'CATEGORY:MONITOR',
            'STRIPE_WEBHOOK'
          ]
        })
      ]
    });

    const decision = await aj.protect(request);
    return NextResponse.json({ allowed: !decision.isDenied() });
  } catch (error) {
    console.error('Security check failed:', error);
    return NextResponse.json({ allowed: true }); // Fail open in case of errors
  }
}
