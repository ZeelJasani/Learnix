/**
 * Admin Root Page — /admin route nu redirect page
 * Admin Root Page — Redirect page for /admin route
 *
 * Aa page /admin par access kare tyare automatically /admin/dashboard par redirect kare chhe
 * This page automatically redirects to /admin/dashboard when accessing /admin
 *
 * Note: RenderRecentCourses ane skeleton functions unused/legacy code chhe
 * Note: RenderRecentCourses and skeleton functions are unused/legacy code
 */
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  
  redirect(`${baseUrl}/admin/dashboard`);
}


