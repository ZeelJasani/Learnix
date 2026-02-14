import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Aa route live session start karva mate chhe
// This route is for starting a live session

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/live-sessions/${params.id}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ error: data.message || "Failed to start session" }, { status: 500 });
        }

        return NextResponse.json({ success: true, session: data.data });
    } catch (error) {
        console.error("Error starting live session:", error);
        return NextResponse.json({ error: "Failed to start live session" }, { status: 500 });
    }
}
