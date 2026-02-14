// Aa file current user na enrolled courses list fetch karva mate API route provide kare chhe
// This file provides an API route to fetch the current user's enrolled courses list
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET() {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ courses: [] });
        }

        const response = await fetch(`${API_BASE_URL}/users/enrolled-courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success || !data.data) {
            return NextResponse.json({ courses: [] });
        }

        return NextResponse.json({ courses: data.data });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return NextResponse.json({ courses: [] });
    }
}
