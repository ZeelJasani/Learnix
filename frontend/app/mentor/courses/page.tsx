import { api, getAuthToken } from "@/lib/api-client";
import { requireUser } from "@/app/data/user/require-user";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { AdminCourseCard } from "@/app/admin/courses/_components/AdminCourseCard";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { Separator } from "@/components/ui/separator";

// Interface matching AdminCourseType for compatibility
interface Course {
    id: string;
    title: string;
    smallDescription: string;
    duration: number;
    level: string;
    status: string;
    price: number;
    fileKey: string;
    category: string;
    slug: string;
    chapterCount?: number;
}

export default async function MentorCoursesPage() {
    const userData = await requireUser();
    const token = await getAuthToken();

    // Handle both direct user object and wrapped {synced, user} structure
    // const user = ('user' in userData ? (userData as any).user : userData);

    const coursesResponse = await api.get<Course[]>(
        "/mentor/courses",
        token ?? undefined
    );

    const courses = coursesResponse.data || [];

    return (
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
                    <p className="text-muted-foreground">
                        Manage and edit your course content
                    </p>
                </div>
                <Link
                    href="/mentor/courses/create"
                    className={buttonVariants()}
                >
                    Create New Course
                </Link>
            </div>

            <Separator />

            {courses.length === 0 ? (
                <EmptyState
                    title="No courses found"
                    description="You haven't created any courses yet."
                    buttonText="Create your first course"
                    href="/mentor/courses/create"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <AdminCourseCard key={course.id} data={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
