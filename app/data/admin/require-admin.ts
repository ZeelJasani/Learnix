// "server-only";

import { redirect } from "next/navigation";
import { requireUser } from "@/app/data/user/require-user";

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function requireAdmin(returnJson = false) {
  try {
    const user = await requireUser();

    // Debug log for production
    // if (process.env.NODE_ENV === 'production') {
    //   console.log('requireAdmin: session present?', !!session);
    //   if (session?.user) {
    //     console.log(`requireAdmin: user id=${session.user.id} role=${session.user.role}`);
    //   }
    // }

    if (!user) {
      if (returnJson) throw new UnauthorizedError('Authentication required');
      redirect('/login');
    }

    const userRole = (user.role || '').toString().toLowerCase();
    if (userRole !== 'admin') {
      if (returnJson) throw new UnauthorizedError('Insufficient permissions');
      redirect('/not-admin');
    }

    return { user };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error in requireAdmin:', error);
    }
    if (returnJson) throw error;
    redirect('/error');
  }
}