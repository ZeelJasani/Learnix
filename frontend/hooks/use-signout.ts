// "use client";

// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// // import { useRouter } from "next/router";

// export function useSignOut() {
//     const router = useRouter
//   const handlerSignout = async function signOut() {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/"); // redirect to login page
//           toast.success("Signed out successfully");
//         },
//         onError: () => {
//           toast.error("Failed to sign out");
//         },
//       },
//     });
//   }

//   return handlerSignout;
// }




"use client";

import { useRouter } from "next/navigation"; // Correct import for Next.js App Router
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

export function useSignOut() {
  // Correctly call the useRouter hook to get the router instance
  const router = useRouter(); 
  const clerk = useClerk();

  const handlerSignout = async function signOut() {
    try {
      await clerk.signOut();
      router.push("/");
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return handlerSignout;
}