// "server-only";

import { redirect } from "next/navigation";
import { requireUser } from "@/app/data/user/require-user";

export async function requireAdmin(returnJson = false) {
  try {
    const user = await requireUser();

    if (!user) {
      if (returnJson) {
        throw new Error('Authentication required');
      }
      redirect('/login');
    }

    const userRole = (user.role || '').toString().toLowerCase();
    if (userRole !== 'admin') {
      if (returnJson) {
        throw new Error('Insufficient permissions');
      }
      redirect('/not-admin');
    }

    return { user };
  } catch (error) {
    // Check if this is a Next.js redirect (which throws an error internally)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    // If we have a redirect digest, it means Next.js is trying to redirect
    if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    // For other errors, redirect to not-admin if it's an auth issue
    if (returnJson) {
      throw error;
    }

    redirect('/not-admin');
  }
}