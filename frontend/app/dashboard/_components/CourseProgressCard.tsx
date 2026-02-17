"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
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

export function CourseProgressCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.Course.fileKey);
    const { totalLesson, completedLessons, progressPercentage } =
        useCourseProgress({ courseData: data.Course as unknown as SidebarCourse });

    return (
        <Card className="group overflow-hidden py-0 gap-0 h-full flex flex-col border-border/60 hover:border-border transition-colors">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={thumbnailUrl}
                    alt={data.Course.title}
                />
            </div>

            <CardContent className="flex flex-col flex-1 p-5">
                <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{data.Course.level}</p>
                    <Link href={`/dashboard/${data.Course.slug}`} className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors block mb-1.5">
                        {data.Course.title}
                    </Link>
                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed mb-4">
                        {data.Course.smallDescription}
                    </p>
                </div>

                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{completedLessons}/{totalLesson} lessons</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />

                    <Link
                        href={`/dashboard/${data.Course.slug}`}
                        className={buttonVariants({ variant: "outline", size: "sm", className: "w-full mt-2 text-xs" })}
                    >
                        Continue Learning
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
