"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: PublicCourseType
}

// Map levels to colors
const levelColors: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
    ADVANCED: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
};

// Map categories to colors
const categoryColors: Record<string, string> = {
    Development: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
    Design: "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-400",
    Business: "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400",
    Marketing: "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-400",
};

export function PublicCourseCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.fileKey);
    const levelClass = levelColors[data.level] || levelColors.BEGINNER;
    const categoryClass = categoryColors[data.category] || "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400";

    return (
        <Card className="group relative overflow-hidden py-0 gap-0 hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
            {/* Image Container */}
            <div className="relative overflow-hidden">
                {/* Level Badge */}
                <Badge className={`absolute top-3 right-3 z-10 ${levelClass} border-0 shadow-sm`}>
                    {data.level}
                </Badge>

                {/* Image with hover zoom */}
                <div className="overflow-hidden">
                    <Image
                        width={600}
                        height={400}
                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                        src={thumbnailUrl}
                        alt={data.title}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardContent className="p-5">
                {/* Category Tag */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryClass}`}>
                    {data.category}
                </span>

                {/* Title */}
                <Link
                    href={`/courses/${data.slug}`}
                    className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors block mb-2 group-hover:text-primary"
                >
                    {data.title}
                </Link>

                {/* Description */}
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-4">
                    {data.smallDescription}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        <span>{data.duration}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="size-4" />
                        <span>{data.chapterCount || 0} chapters</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                    {/* Price */}
                    <div>
                        <span className="text-2xl font-bold text-primary">
                            ₹{data.price}
                        </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/courses/${data.slug}`}
                        className={buttonVariants({
                            variant: "default",
                            size: "sm",
                            className: "group/btn gap-1"
                        })}
                    >
                        Enroll Now
                        <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0 overflow-hidden">
            <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="w-full aspect-video" />
            </div>

            <CardContent className="p-5">
                <Skeleton className="h-5 w-20 rounded-full mb-3" />

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}