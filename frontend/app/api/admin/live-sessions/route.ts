import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Aa file admin live sessions mate API routes provide kare chhe
// This file provides API routes for admin live sessions

// GET - List all sessions (Admin)
// GET - Badha sessions list karo (Admin)
export async function GET(request: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/live-sessions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ sessions: [] });
        }

        return NextResponse.json({ sessions: data.data.sessions });
    } catch (error) {
        console.error("Error fetching live sessions:", error);
        return NextResponse.json({ error: "Failed to fetch live sessions" }, { status: 500 });
    }
}

// POST - Create new session
// POST - Navo session create karo
export async function POST(request: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/live-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ error: data.message || "Failed to create session" }, { status: 500 });
        }

        return NextResponse.json({ session: data.data });
    } catch (error) {
        console.error("Error creating live session:", error);
        return NextResponse.json({ error: "Failed to create live session" }, { status: 500 });
    }
}
