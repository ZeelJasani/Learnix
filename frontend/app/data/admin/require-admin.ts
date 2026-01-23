import "server-only";
import { redirect } from "next/navigation";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { api, getAuthToken } from "@/lib/api-client";
import { headers } from "next/headers";

interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: string | null;
}

/**
 * Get the base URL for redirects
 */
async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
}

export async function requireAdmin(returnJson = false) {
  try {
    const user = await currentUser();
    const baseUrl = await getBaseUrl();

    if (!user) {
      if (returnJson) {
        throw new Error('Authentication required');
      }
      redirect(`${baseUrl}/login`);
    }

    // ✅ INSTANT: Check Clerk publicMetadata first
    const metadataRole = (user.publicMetadata as { role?: string })?.role;

    if (metadataRole?.toLowerCase() === 'admin') {
      // 🔄 BACKGROUND: Sync to DB silently (non-blocking)
      backgroundSyncUser(user);
      return { userId: user.id, role: metadataRole, user: { id: user.id, role: metadataRole } };
    }

    // If no metadata or not admin in metadata, check the database
    const token = await getAuthToken();

    if (!token) {
      if (returnJson) {
        throw new Error('Authentication required');
      }
      redirect(`${baseUrl}/login`);
    }

    // Sync user and check role from database
    const syncResponse = await api.post<{ user: UserProfile }>('/users/sync', {
      clerkId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }, token);

    const dbUser = syncResponse.data?.user;
    const role = dbUser?.role;

    // Update Clerk metadata if role differs (for next instant load)
    if (role && role !== metadataRole) {
      updateClerkMetadata(user.id, role);
    }

    if (!role || role.toLowerCase() !== 'admin') {
      if (returnJson) {
        throw new Error('Insufficient permissions');
      }
      redirect(`${baseUrl}/not-admin`);
    }

    return { userId: user.id, role, user: dbUser };
  } catch (error: any) {
    // Handle dynamic server usage errors during build/SSG
    if (error?.digest === 'DYNAMIC_SERVER_USAGE' || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error in requireAdmin:', error);
    if (returnJson) {
      throw error;
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    redirect(`${baseUrl}/login`);
  }
}

/**
 * Check if current user is an admin (returns boolean, doesn't redirect)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;

    // ✅ INSTANT: Check Clerk publicMetadata first
    const metadataRole = (user.publicMetadata as { role?: string })?.role;

    if (metadataRole?.toLowerCase() === 'admin') {
      // 🔄 BACKGROUND: Sync to DB silently (non-blocking)
      backgroundSyncUser(user);
      return true;
    }

    // If not in metadata, check database
    const token = await getAuthToken();
    if (!token) return false;

    // Sync and get user data
    const syncResponse = await api.post<{ user: UserProfile }>('/users/sync', {
      clerkId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }, token);

    const role = syncResponse.data?.user?.role;

    // Update Clerk metadata if role differs
    if (role && role !== metadataRole) {
      updateClerkMetadata(user.id, role);
    }

    return role?.toLowerCase() === 'admin';
  } catch (error: any) {
    // Handle dynamic server usage errors during build/SSG
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      return false;
    }
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Background sync user to database (non-blocking)
 */
function backgroundSyncUser(user: any) {
  // Fire and forget
  (async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      await api.post('/users/sync', {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }, token);
    } catch (error) {
      console.error('Background sync error:', error);
    }
  })();
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