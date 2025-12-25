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

  // Skip middleware for static files and public routes
  if (pathname.startsWith("/_next/static") || pathname.startsWith("/api/public") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Avoid recursive middleware -> API -> middleware loops
  if (pathname === "/api/security") {
    return NextResponse.next();
  }

  // Allow external webhooks (Stripe, Clerk, etc.)
  if (pathname.startsWith("/api/webhook/")) {
    return NextResponse.next();
  }

  // Protect app pages
  if (isProtectedRoute(request)) {
    await auth.protect({ unauthenticatedUrl: "/login" });
  }

  // Skip security checks in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // For API and admin routes in production, verify security
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    try {
      const securityUrl = new URL("/api/security", request.url);
      const securityCheck = await fetch(securityUrl.toString(), {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({}),
      });

      const { allowed } = await securityCheck.json();
      if (!allowed) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } catch (error) {
      console.error("Security check failed:", error);
      // Fail open in case of errors
    }
  }

  return NextResponse.next();
});