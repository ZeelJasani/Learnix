// Aa file Clerk user ni publicMetadata ma role update karva mate API route provide kare chhe
// This file provides an API route to update a Clerk user's role in publicMetadata
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { role } = await request.json();

        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }

        // Update Clerk publicMetadata with the role
        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: role,
            },
        });

        return NextResponse.json({ success: true, role });
    } catch (error) {
        console.error("Error updating user metadata:", error);
        return NextResponse.json(
            { error: "Failed to update metadata" },
            { status: 500 }
        );
    }
}
