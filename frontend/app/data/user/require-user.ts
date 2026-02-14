// Aa file user authentication guard chhe (haal commented out chhe, future use mate)
// This file provides user authentication verification guard (currently commented out for future use)
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

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getOrCreateDbUserFromClerkUser } from "@/lib/clerk-db";

export const requireUser = cache(async () => {
  const user = await currentUser();
  if (!user) {
    return redirect("/login");
  }

  return getOrCreateDbUserFromClerkUser(user);
});