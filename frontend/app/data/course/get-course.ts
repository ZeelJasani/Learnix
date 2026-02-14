// Aa file ek specific course ni public details (mentor, chapters, price) fetch kare chhe
// This file fetches a single course's public details including mentor info, chapters, and pricing
import "server-only";

import { api } from "@/lib/api-client";
import { notFound } from "next/navigation";

export interface CourseChapter {
    id: string;
    title: string;
    lessons: Array<{
        id: string;
        title: string;
    }>;
}

export interface IndividualCourseType {
    id: string;
    title: string;
    description: string;
    fileKey: string;
    price: number;
    duration: number;
    level: string;
    category: string;
    smallDescription: string;
    chapters?: CourseChapter[];
    chapter?: CourseChapter[];
}

export async function getIndividualCourse(slug: string): Promise<IndividualCourseType> {
    const response = await api.get<IndividualCourseType>(`/courses/${slug}`);

    if (!response.success || !response.data) {
        return notFound();
    }

    // Map API response to expected format (backend uses 'chapters', frontend expects 'chapter')
    const course = response.data;
    if (course.chapters && !course.chapter) {
        course.chapter = course.chapters;
    }

    return course;
}