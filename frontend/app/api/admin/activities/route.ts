import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// GET - List all activities (with course filter)
export async function GET(request: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        const endpoint = courseId
            ? `${API_BASE_URL}/admin/activities/${courseId}`
            : `${API_BASE_URL}/admin/activities`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ activities: [] });
        }

        return NextResponse.json({ activities: data.data });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }
}

// POST - Create new activity
export async function POST(request: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        console.log("[API Route] Creating activity with body:", body);

        const response = await fetch(`${API_BASE_URL}/admin/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        console.log("[API Route] Backend response status:", response.status);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("[API Route] Failed to parse backend JSON response");
            const text = await response.text();
            console.error("[API Route] Backend response text:", text);
            return NextResponse.json({ error: "Backend error (non-JSON)" }, { status: 500 });
        }

        console.log("[API Route] Backend response data:", data);

        if (!data.success) {
            return NextResponse.json({ error: data.message || "Failed to create activity" }, { status: 500 });
        }

        return NextResponse.json({ activity: data.data });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
    }
}

// DELETE - Remove activity
export async function DELETE(request: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get("id");

        if (!activityId) {
            return NextResponse.json({ error: "Activity ID required" }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}/admin/activities/${activityId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ error: data.message || "Failed to delete activity" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
    }
}
