"use client";

import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { MoreVertical, Pencil, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
    const pathname = usePathname();
    const isMentor = pathname?.startsWith("/mentor");
    const basePath = isMentor ? "/mentor" : "/admin";

    const CourseImage = useConstructUrl(data.fileKey);
    const editLink = `${basePath}/courses/${data.id}/edit`;

    return (
        <Card className="group overflow-hidden py-0 gap-0 border-border/60 hover:border-border transition-all duration-200">
            {/* Image */}
            <div className="relative overflow-hidden">
                <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 z-10 text-[10px] uppercase font-semibold tracking-wider"
                >
                    {data.level}
                </Badge>

                <div className="absolute top-3 right-3 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-7 w-7 bg-black/40 hover:bg-black/60 border-none text-white">
                                <MoreVertical className="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={editLink}>
                                    <Pencil className="size-3.5 mr-2" />
                                    Edit Course
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/courses/${data.slug || data.id}`}>
                                    <Eye className="size-3.5 mr-2" />
                                    Preview
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
                                <Link href={`${basePath}/courses/${data.id}/delete`}>
                                    <Trash2 className="size-3.5 mr-2" />
                                    Delete
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Image
                    width={600}
                    height={400}
                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    src={CourseImage}
                    alt={data.title}
                />
            </div>

            <CardContent className="p-4 space-y-3">
                {/* Category + Mentor */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{data.category}</span>
                    {data.mentor && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground truncate max-w-[80px]">{data.mentor.name}</span>
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={data.mentor.image} alt={data.mentor.name} />
                                <AvatarFallback className="text-[8px]">
                                    {data.mentor.name?.substring(0, 2).toUpperCase() || "ME"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>

                {/* Title */}
                <Link href={editLink} className="block">
                    <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors leading-snug">
                        {data.title}
                    </h3>
                </Link>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="text-base font-semibold">₹{data.price}</span>
                    <span className="text-xs text-muted-foreground">{data.chapterCount || 0} chapters • {data.duration}h</span>
                </div>
            </CardContent>
        </Card>
    );
}

export function AdminCourseCardSkeleton() {
    return (
        <Card className="overflow-hidden py-0 gap-0">
            <Skeleton className="w-full aspect-video" />
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}