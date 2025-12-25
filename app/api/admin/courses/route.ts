import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - List all courses for admin
export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                status: true,
                fileKey: true,
                smallDescription: true,
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ courses: [] });
    }
}
