import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const courses = await prisma.course.findMany({
            where: {
                status: "PUBLISHED",
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                smallDescription: true,
                fileKey: true,
            },
            take: 10,
            orderBy: { createdAt: "desc" },
        });

        const results = courses.map((course) => ({
            id: course.id,
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
