// "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function requireAdmin(returnJson = false) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Debug log for production
    // if (process.env.NODE_ENV === 'production') {
    //   console.log('requireAdmin: session present?', !!session);
    //   if (session?.user) {
    //     console.log(`requireAdmin: user id=${session.user.id} role=${session.user.role}`);
    //   }
    // }

    if (!session?.user) {
      if (returnJson) throw new UnauthorizedError('Authentication required');
      redirect('/login');
    }

    const userRole = (session.user.role || '').toString().toLowerCase();
    if (userRole !== 'admin') {
      if (returnJson) throw new UnauthorizedError('Insufficient permissions');
      redirect('/not-admin');
    }

    return session;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error in requireAdmin:', error);
    }
    if (returnJson) throw error;
    redirect('/error');
  }
}