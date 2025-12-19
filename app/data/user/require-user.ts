// import "server-only";

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { cache } from "react";

// export async function requireUser() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     return redirect("/login");
//   }

//   return session.user;
// }




import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireUser = cache(async () => {
  // In development, add timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Authentication timeout')), 5000);
  });

  try {
    const sessionPromise = auth.api.getSession({
      headers: await headers(),
    });

    const session = await Promise.race([sessionPromise, timeoutPromise]);

    if (!session) {
      return redirect("/login");
    }

    return session.user;
  } catch (error) {
    console.error('Authentication error:', error);
    return redirect("/login");
  }
});