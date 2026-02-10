import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { userId, getToken } = await auth();
        const { slug } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const token = await getToken();

        // 1. Get Course by Slug from Backend
        const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/slug/${slug}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!courseRes.ok) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const courseData = await courseRes.json();
        const courseId = courseData.data?._id || courseData._id;

        if (!courseId) {
            return new NextResponse("Invalid course data", { status: 500 });
        }

        // 2. Fetch quizzes for this course from Backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.text();
            return new NextResponse(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[STUDENT_QUIZZES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
