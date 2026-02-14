// Aa file Clerk authenticated user ne database sathe sync kare chhe (getOrCreate pattern)
// This file syncs the current Clerk user with the database, creating the record if needed
import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateDbUserFromClerkUser } from "@/lib/clerk-db";

export async function syncCurrentUser() {
    try {
        const user = await currentUser();
        if (!user) {
            return false;
        }

        await getOrCreateDbUserFromClerkUser(user);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // During build time (static generation), accessing headers (cookies) throws a dynamic server usage error.
        // We can safely ignore this as there is no user to sync during build.
        if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
            return false;
        }
        console.error("Error syncing current user:", error);
        return false;
    }
}
