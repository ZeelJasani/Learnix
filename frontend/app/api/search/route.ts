import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        // Call the backend API for search
        const response = await fetch(`${API_BASE_URL}/courses/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!data.success || !data.data) {
            return NextResponse.json({ results: [] });
        }

        const results = data.data.map((course: any) => ({
            id: course.id || course._id,
            title: course.title,
            slug: course.slug,
            category: course.category,
            description: course.smallDescription,
            thumbnail: course.fileKey
                ? `https://utfs.io/f/${course.fileKey}`
                : null,
        }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
    }
}
