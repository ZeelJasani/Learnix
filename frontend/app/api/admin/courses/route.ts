// Aa file admin panel mate badha courses ni list fetch karva API route provide kare chhe
// This file provides an API route to fetch all courses for the admin panel
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// GET - List all courses for admin
export async function GET() {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/admin/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ courses: [] });
        }

        return NextResponse.json({ courses: data.data });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ courses: [] });
    }
}
