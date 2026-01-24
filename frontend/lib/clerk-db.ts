import "server-only";

import { api, getAuthToken } from "@/lib/api-client";
import { clerkClient } from "@clerk/nextjs/server";

export type ClerkUserLike = {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  publicMetadata?: { role?: string };
};

export type DbUser = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
};

export async function getOrCreateDbUserFromClerkUser(clerkUser: ClerkUserLike): Promise<DbUser> {
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  const token = await getAuthToken();

  if (!token) {
    // Return a basic user object if no token (during build/SSG)
    return {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0],
      email,
      emailVerified: true,
      image: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata as { role?: string })?.role || null,
    };
  }

  // Call the backend API to sync the user
  const response = await api.post<DbUser>('/users/sync', {
    clerkId: clerkUser.id,
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  }, token);

  if (response.success && response.data) {
    const dbUser = response.data;

    // Update Clerk metadata if role differs (for next instant load)
    const metadataRole = (clerkUser.publicMetadata as { role?: string })?.role;
    if (dbUser.role && dbUser.role !== metadataRole) {
      updateClerkMetadata(clerkUser.id, dbUser.role);
    }

    return dbUser;
  }

  // Fallback if sync fails
  return {
    id: clerkUser.id,
    clerkId: clerkUser.id,
    name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0],
    email,
    emailVerified: true,
    image: clerkUser.imageUrl,
    role: (clerkUser.publicMetadata as { role?: string })?.role || null,
  };
}

/**
 * Update Clerk publicMetadata with role (non-blocking)
 */
function updateClerkMetadata(userId: string, role: string) {
  // Fire and forget
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
