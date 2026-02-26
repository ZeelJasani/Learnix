"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";

interface CourseData {
    id?: string;
    _id?: string;
    title: string;
    level?: string;
    fileKey?: string;
    category?: string;
    price?: number;
    chapterCount?: number;
    duration?: number;
}

interface SelectCourseCardProps {
    data: CourseData;
    onClick: () => void;
    badgeText?: string;
}

export function SelectCourseCard({ data, onClick, badgeText }: SelectCourseCardProps) {
    const CourseImage = useConstructUrl(data.fileKey || "");

    return (
        <Card
            onClick={onClick}
            className="group overflow-hidden py-0 gap-0 border-border/60 hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col h-full"
        >
            <div className="relative overflow-hidden shrink-0">
                {data.level && (
                    <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 z-10 text-[10px] uppercase font-semibold tracking-wider bg-background/80 backdrop-blur-sm"
                    >
                        {data.level}
                    </Badge>
                )}

                {badgeText && (
                    <Badge
                        variant="default"
                        className="absolute top-3 right-3 z-10 text-[10px] font-semibold shadow-md"
                    >
                        {badgeText}
                    </Badge>
                )}

                {data.fileKey ? (
                    <Image
                        width={600}
                        height={400}
                        className="w-full aspect-video object-cover"
                        src={CourseImage}
                        alt={data.title || "Course representation"}
                    />
                ) : (
                    <div className="w-full aspect-video bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs font-medium">No cover image</span>
                    </div>
                )}
            </div>

            <CardContent className="p-4 space-y-3 flex flex-col flex-grow bg-card relative z-20">
                <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{data.category || "Uncategorized"}</div>

                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug flex-grow">
                    {data.title}
                </h3>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 shrink-0">
                    <span className="text-sm font-bold">₹{data.price || 0}</span>
                    <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                        {data.chapterCount || 0} chapters • {data.duration || 0}h
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
