// ============================================================================
// Learnix LMS - Sign Out Hook (સાઇન આઉટ હુક)
// ============================================================================
// Aa hook Clerk authentication dwara user ne sign out kare chhe.
// This hook signs out the user via Clerk authentication.
//
// Sign out pachi "/" page par redirect kare chhe ane toast show kare chhe.
// After sign out, redirects to "/" page and shows a toast notification.
// ============================================================================

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

/**
 * Sign out handler return karo / Return sign out handler
 *
 * Clerk signOut call kare chhe, success/error toast batave chhe.
 * Calls Clerk signOut, shows success/error toast.
 */
export function useSignOut() {
  // Next.js App Router instance / Next.js App Router instance
  const router = useRouter();
  // Clerk instance signOut method mate / Clerk instance for signOut method
  const clerk = useClerk();

  // Sign out handler function / Sign out handler function
  const handlerSignout = async function signOut() {
    try {
      await clerk.signOut();
      // Home page par redirect karo / Redirect to home page
      router.push("/");
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return handlerSignout;
}