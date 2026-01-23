import { clerkMiddleware, createRouteMatcher, type ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)", "/profile(.*)", "/settings(.*)"]);

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Protect app pages
  if (isProtectedRoute(request)) {
    await auth.protect({ unauthenticatedUrl: "/login" });
  }

  return NextResponse.next();
});