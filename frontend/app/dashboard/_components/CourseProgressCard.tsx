/**
 * CourseProgressCard Component — Enrolled course ni progress card with thumbnail ane progress bar
 * CourseProgressCard Component — Enrolled course progress card with thumbnail and progress bar
 *
 * Aa client component chhe je dashboard page par enrolled course ni details ane progress display kare chhe
 * This is a client component that displays enrolled course details and progress on dashboard page
 *
 * Features:
 * - Course thumbnail — useConstructUrl() thi S3 image URL construct kare chhe
 *   Course thumbnail — Constructs S3 image URL via useConstructUrl()
 * - useCourseProgress hook — Total/completed lessons ane percentage calculate kare chhe
 *   useCourseProgress hook — Calculates total/completed lessons and percentage
 * - Level badge — Color-coded (BEGINNER=green, INTERMEDIATE=amber, ADVANCED=rose)
 * - Progress bar — shadcn Progress component with percentage display
 * - "Watch Course" button — Course detail page par navigate kare chhe
 *   "Watch Course" button — Navigates to course detail page
 * - Hover effect — Image scale-up animation on card hover
 */
"use client";


import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: EnrolledCourseType;
}

const levelColors: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
    ADVANCED: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
};

export function CourseProgressCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.Course.fileKey);
    const { totalLesson, completedLessons, progressPercentage } =
        useCourseProgress({ courseData: data.Course as unknown as SidebarCourse });

    // Determine the color for the level badge
    const levelClass = levelColors[data.Course.level] || levelColors.BEGINNER;

    return (
        <Card className="group relative overflow-hidden py-0 gap-0 h-full flex flex-col border-border/50 hover:border-border transition-colors">

            <Badge className={`absolute top-3 right-3 z-10 font-bold shadow-md ${levelClass} border-0`}>{data.Course.level}</Badge>

            <div className="relative aspect-video overflow-hidden border-b border-border/50">
                <Image
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={thumbnailUrl}
                    alt="Thumbnail Image of Course"
                />
            </div>


            <CardContent className="flex flex-col flex-1 p-6">
                <div className="flex-1">
                    <Link href={`/dashboard/${data.Course.slug}`} className="font-bold text-xl line-clamp-2 hover:text-primary transition-colors block mb-2">
                        {data.Course.title}
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-6">
                        {data.Course.smallDescription}
                    </p>
                </div>

                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <p>Progress</p>
                        <p>{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-2 rounded-full" />
                    <p className="text-xs text-muted-foreground pt-1">
                        {completedLessons} of {totalLesson} lessons completed
                    </p>

                    <Link
                        href={`/dashboard/${data.Course.slug}`}
                        className={buttonVariants({ className: "w-full mt-4 font-semibold shadow-sm" })}
                    >
                        Watch Course
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

