// ============================================================================
// Learnix LMS - Middleware (મિડલવેર)
// ============================================================================
// Aa file Clerk authentication middleware configure kare chhe.
// This file configures the Clerk authentication middleware.
//
// Protected routes mate authentication enforce kare chhe.
// Enforces authentication for protected routes.
//
// Protected routes / સુરક્ષિત રૂટ્સ:
// - /admin/*    → Admin dashboard pages
// - /dashboard/* → Student dashboard pages
// - /profile/*  → User profile pages
// - /live/*     → Live session pages
// ============================================================================

import { clerkMiddleware, createRouteMatcher, type ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Static assets ane Next.js internal routes exclude karo
// Exclude static assets and Next.js internal routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};

// Protected routes define karo - aa routes mate login required chhe
// Define protected routes - login required for these routes
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/dashboard(.*)",
  "/profile(.*)",
  "/live(.*)",
]);

// Clerk middleware - authentication enforce karo protected routes mate
// Clerk middleware - enforce authentication for protected routes
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Protected route hoy to authentication check karo
  // Check authentication if it's a protected route
  if (isProtectedRoute(request)) {
    await auth.protect({ unauthenticatedUrl: "/login" });
  }

  return NextResponse.next();
});
