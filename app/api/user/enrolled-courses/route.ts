import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ courses: [] });
        }

        // Try to find user by clerkUserId or email
        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: user.id },
                    { email: user.emailAddresses[0]?.emailAddress }
                ]
            },
        });

        if (!dbUser) {
            return NextResponse.json({ courses: [] });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: { userId: dbUser.id },
            include: {
                Course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        smallDescription: true,
                        category: true,
                        fileKey: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ courses: enrollments });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return NextResponse.json({ courses: [] });
    }
}
