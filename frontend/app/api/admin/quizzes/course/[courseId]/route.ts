import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId, getToken } = await auth();
        const { courseId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const token = await getToken();
        // Forward request to backend service
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("[API ROUTE] Backend response status:", response.status);

        if (!response.ok) {
            const error = await response.text();
            return new NextResponse(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[QUIZZES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
