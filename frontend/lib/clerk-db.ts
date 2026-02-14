// ============================================================================
// Learnix LMS - Clerk Database Sync (Clerk ડેટાબેસ સિંક)
// ============================================================================
// Aa file Clerk user data ne backend database sathe sync kare chhe.
// This file syncs Clerk user data with the backend database.
//
// Features / વિશેષતાઓ:
// - Clerk user → DB user sync (API call dwara)
// - Build-time fallback (token na hoy tyare)
// - Clerk publicMetadata ma role auto-update
// - Non-blocking metadata update (fire-and-forget)
//
// ⚠️ Server-only: Aa module faqat server-side code ma use thay chhe
// ⚠️ Server-only: This module is only used in server-side code
// ============================================================================

import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { clerkClient } from "@clerk/nextjs/server";

// Clerk user type definition / Clerk user no type
export type ClerkUserLike = {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  publicMetadata?: { role?: string };
};

// Database user type definition / Database user no type
// Note: Backend User model timestamps: true chhe, etle createdAt ane updatedAt auto-add thay chhe
// Note: Backend User model has timestamps: true, so createdAt and updatedAt are auto-added
export type DbUser = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason?: string | null;
  banExpires?: string | null;
  stripeCustomerId?: string | null;
  createdAt: string;
  updatedAt?: string;
};

/**
 * Clerk user ne database ma sync karo / Sync Clerk user to database
 *
 * Backend API ne call karine user create ke update kare chhe.
 * Calls backend API to create or update user.
 * Token na hoy to (build/SSG time) basic user object return kare chhe.
 * Returns basic user object during build/SSG time when no token is available.
 */
export async function getOrCreateDbUserFromClerkUser(clerkUser: ClerkUserLike): Promise<DbUser> {
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  const token = await getAuthToken();

  if (!token) {
    // Build/SSG time fallback - token vagar basic object return karo
    // Build/SSG time fallback - return basic object without token
    return {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0],
      email,
      emailVerified: true,
      image: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata as { role?: string })?.role || null,
      banned: false,
      stripeCustomerId: null,
      createdAt: new Date().toISOString(),
    };
  }

  // Backend API ne user sync karva call karo / Call backend API to sync user
  const response = await api.post<DbUser>('/users/sync', {
    clerkId: clerkUser.id,
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  }, token);

  if (response.success && response.data) {
    const dbUser = response.data;

    // DB role alag hoy to Clerk metadata update karo (next load mate instant)
    // Update Clerk metadata if DB role differs (for instant next load)
    const metadataRole = (clerkUser.publicMetadata as { role?: string })?.role;
    if (dbUser.role && dbUser.role !== metadataRole) {
      updateClerkMetadata(clerkUser.id, dbUser.role);
    }

    return dbUser;
  }

  // Sync fail thay to fallback / Fallback if sync fails
  return {
    id: clerkUser.id,
    clerkId: clerkUser.id,
    name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0],
    email,
    emailVerified: true,
    image: clerkUser.imageUrl,
    role: (clerkUser.publicMetadata as { role?: string })?.role || null,
    banned: false,
    stripeCustomerId: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Clerk publicMetadata ma role update karo (non-blocking)
 * Update role in Clerk publicMetadata (non-blocking)
 *
 * Fire-and-forget pattern - main flow block nathi thato.
 * Fire-and-forget pattern - doesn't block the main flow.
 */
function updateClerkMetadata(userId: string, role: string) {
  (async () => {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      });
    } catch (error) {
      console.error('Error updating Clerk metadata:', error);
    }
  })();
}
