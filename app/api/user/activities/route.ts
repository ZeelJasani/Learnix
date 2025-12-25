import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch activities for user's enrolled courses
export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ activities: [] });
        }

        // Find user in database
        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: user.id },
                    { email: user.emailAddresses[0]?.emailAddress }
                ]
            }
        });

        if (!dbUser) {
            return NextResponse.json({ activities: [] });
        }

        // Get user's enrolled course IDs
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: dbUser.id, status: "Active" },
            select: { courseId: true }
        });

        const enrolledCourseIds = enrollments.map(e => e.courseId);

        if (enrolledCourseIds.length === 0) {
            return NextResponse.json({ activities: [] });
        }

        // Fetch activities for enrolled courses
        const activities = await prisma.activity.findMany({
            where: { courseId: { in: enrolledCourseIds } },
            include: {
                course: {
                    select: { id: true, title: true, slug: true }
                },
                completions: {
                    where: { userId: dbUser.id },
                    select: { id: true, completedAt: true }
                }
            },
            orderBy: [
                { dueDate: "asc" },
                { createdAt: "desc" }
            ]
        });

        // Transform to include completion status
        const activitiesWithStatus = activities.map(activity => ({
            ...activity,
            isCompleted: activity.completions.length > 0,
            completedAt: activity.completions[0]?.completedAt || null
        }));

        return NextResponse.json({ activities: activitiesWithStatus });
    } catch (error) {
        console.error("Error fetching user activities:", error);
        return NextResponse.json({ activities: [] });
    }
}

// POST - Mark activity as completed
export async function POST(request: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { activityId } = await request.json();

        if (!activityId) {
            return NextResponse.json({ error: "Activity ID required" }, { status: 400 });
        }

        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: user.id },
                    { email: user.emailAddresses[0]?.emailAddress }
                ]
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create completion record
        const completion = await prisma.activityCompletion.upsert({
            where: {
                userId_activityId: {
                    userId: dbUser.id,
                    activityId
                }
            },
            update: {},
            create: {
                userId: dbUser.id,
                activityId
            }
        });

        return NextResponse.json({ success: true, completion });
    } catch (error) {
        console.error("Error completing activity:", error);
        return NextResponse.json({ error: "Failed to complete activity" }, { status: 500 });
    }
}
