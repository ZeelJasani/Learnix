import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { Suspense } from "react";
import { TrendingUp, Flame, BookOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function PublicCoursesRoute() {
    return (
        <div className="min-h-screen bg-background">


            {/* 
                Courses Section 
                - px-6: left/right padding (change to px-4 for less, px-8 for more)
                - py-4: top/bottom padding (change to py-2 for less, py-6 for more)
                - gap-6 in grid: space between cards (change to gap-4 for less, gap-8 for more)
            */}
            <div className="px-6 py-6">
                {/* Course Grid */}
                <Suspense fallback={<LoadingSkeletonLayout />}>
                    <RenderCourses />
                </Suspense>
            </div>
        </div>
    );
}

async function RenderCourses() {
    const courses = await getAllCourses();

    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <BookOpen className="size-16 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No courses available</h3>
                <p className="text-zinc-400">Check back soon for new courses!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course} />
            ))}
        </div>
    );
}

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}