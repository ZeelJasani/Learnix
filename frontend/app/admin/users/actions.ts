// Aa file Clerk thi database ma users sync karva mate admin server action provide kare chhe
// This file provides an admin server action to sync users from Clerk to the database
"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { getOrCreateDbUserFromClerkUser } from "@/lib/clerk-db";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUsersFromClerk() {
    try {
        await requireAdmin();

        const client = await clerkClient();
        const { data: users } = await client.users.getUserList({
            limit: 100, // Sync last 100 users for now
            orderBy: '-created_at'
        });

        let syncedCount = 0;

        for (const user of users) {
            try {
                // Map Clerk user to our expected format if needed, 
                // but getOrCreateDbUserFromClerkUser usually expects a specific structure.
                // We'll map the Clerk Backend API user object to the specific structure needed.
                const mappedUser = {
                    id: user.id,
                    emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                };

                await getOrCreateDbUserFromClerkUser(mappedUser);
                syncedCount++;
            } catch (err) {
                console.error(`Failed to sync user ${user.id}:`, err);
            }
        }

        revalidatePath("/admin/users");
        return { success: true, count: syncedCount };
    } catch (error) {
        console.error("Error syncing users:", error);
        return { success: false, error: "Failed to sync users" };
    }
}
