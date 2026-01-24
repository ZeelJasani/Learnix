import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// GET - Fetch activities for user's enrolled courses
export async function GET() {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ activities: [] });
        }

        const response = await fetch(`${API_BASE_URL}/activities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success || !data.data) {
            return NextResponse.json({ activities: [] });
        }

        // Transform to match expected format
        const activitiesWithStatus = data.data.map((activity: any) => ({
            ...activity,
            isCompleted: activity.completed || false,
            completedAt: activity.completedAt || null
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
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { activityId } = await request.json();

        if (!activityId) {
            return NextResponse.json({ error: "Activity ID required" }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}/activities/${activityId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ error: data.message || "Failed to complete activity" }, { status: 500 });
        }

        return NextResponse.json({ success: true, completion: data.data });
    } catch (error) {
        console.error("Error completing activity:", error);
        return NextResponse.json({ error: "Failed to complete activity" }, { status: 500 });
    }
}
