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

export default function AdminPage() {
  redirect("/admin/dashboard");
}


