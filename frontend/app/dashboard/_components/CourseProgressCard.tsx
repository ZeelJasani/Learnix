"use client";


import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.Course.fileKey);
    const { totalLesson, completedLessons, progressPercentage } =
        useCourseProgress({ courseData: data.Course as unknown as getCourseSidebarDataType['course'] });
    return (
        <Card className="group relative overflow-hidden py-0 gap-0 h-full flex flex-col border-border/50 hover:border-border transition-colors">

            <Badge className="absolute top-3 right-3 z-10 font-bold shadow-md">{data.Course.level}</Badge>

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

