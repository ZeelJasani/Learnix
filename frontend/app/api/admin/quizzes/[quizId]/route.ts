// Aa file specific quiz ne delete karva mate admin API route provide kare chhe
// This file provides an admin API route to delete a specific quiz by its ID
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { userId, getToken } = await auth();
        const { quizId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const token = await getToken();

        console.log(`[API DELETE] Deleting quiz ${quizId}`);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`, {
            method: 'DELETE',
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
        console.error("[QUIZ_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
