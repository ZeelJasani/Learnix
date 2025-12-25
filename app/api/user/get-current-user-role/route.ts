import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateDbUserFromClerkUser } from "@/lib/clerk-db";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ role: null, isAdmin: false });
        }

        const dbUser = await getOrCreateDbUserFromClerkUser(user);
        const isAdmin = (dbUser.role || "").toLowerCase() === "admin";

        return NextResponse.json({
            role: dbUser.role,
            isAdmin
        });
    } catch (error) {
        console.error("Error getting user role:", error);
        return NextResponse.json({ role: null, isAdmin: false });
    }
}
