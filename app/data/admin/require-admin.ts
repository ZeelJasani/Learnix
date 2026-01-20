import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function requireAdmin(returnJson = false) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    if (returnJson) {
      throw new Error('Authentication required');
    }
    redirect('/login');
  }

  //  Check Clerk's session claims for the role
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  //  Alternatively check public_metadata if you configured it there in Clerk Dashboard
  //  const role = (sessionClaims?.public_metadata as { role?: string })?.role;
  //  We'll check 'role' at the top level of the claim if you used the template shown
  //  Or strictly follow the Clerk template: "role": "{{user.public_metadata.role}}"

  // Based on standard Clerk pattern or the one likely configured:
  // We'll traverse metadata since custom claims usually live there or at root.
  // Assuming the claim name is 'role' from the provided screenshot which shows "role": "{{...}}"
  const role = (sessionClaims as any)?.role || metadata?.role || (sessionClaims as any)?.public_metadata?.role;

  if ((role || '').toString().toLowerCase() !== 'admin') {
    if (returnJson) {
      throw new Error('Insufficient permissions');
    }
    // redirect('/not-admin'); -- Users requested remove not-admin page sometimes, but let's keep redirection safe
    redirect('/dashboard'); // Redirect to dashboard instead of a specific error page for smoother UX
  }

  return { userId, role };
}