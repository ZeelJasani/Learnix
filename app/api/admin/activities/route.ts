import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - List all activities (with course filter)
export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        const activities = await prisma.activity.findMany({
            where: courseId ? { courseId } : undefined,
            include: {
                course: {
                    select: { id: true, title: true, slug: true }
                },
                _count: {
                    select: { completions: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }
}

// POST - Create new activity
export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if admin
        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: user.id },
                    { email: user.emailAddresses[0]?.emailAddress }
                ]
            }
        });

        if (!dbUser || dbUser.role?.toLowerCase() !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, type, startDate, dueDate, courseId } = body;

        if (!title || !courseId) {
            return NextResponse.json({ error: "Title and courseId are required" }, { status: 400 });
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description,
                type: type || "ASSIGNMENT",
                startDate: startDate ? new Date(startDate) : null,
                dueDate: dueDate ? new Date(dueDate) : null,
                courseId
            },
            include: {
                course: {
                    select: { id: true, title: true }
                }
            }
        });

        return NextResponse.json({ activity });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
    }
}

// DELETE - Remove activity
export async function DELETE(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get("id");

        if (!activityId) {
            return NextResponse.json({ error: "Activity ID required" }, { status: 400 });
        }

        // Check if admin
        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: user.id },
                    { email: user.emailAddresses[0]?.emailAddress }
                ]
            }
        });

        if (!dbUser || dbUser.role?.toLowerCase() !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.activity.delete({
            where: { id: activityId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
    }
}
