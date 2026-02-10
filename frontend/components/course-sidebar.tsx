"use client"

import * as React from "react"
import { useState } from "react"
import { GalleryVerticalEnd, PlayCircle, ChevronRight, FolderOpen } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavUser } from "@/components/nav-user"

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
    course: SidebarCourse
}

const DEFAULT_VISIBLE = 3

function ChapterGroup({ chapter, courseSlug, index }: {
    chapter: SidebarCourse["chapter"][number];
    courseSlug: string;
    index: number;
}) {
    const [open, setOpen] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const hasMore = chapter.lessons.length > DEFAULT_VISIBLE
    const visibleLessons = showAll ? chapter.lessons : chapter.lessons.slice(0, DEFAULT_VISIBLE)
    const hiddenCount = chapter.lessons.length - DEFAULT_VISIBLE

    return (
        <div className="px-3 mb-1">

            <button
                onClick={() => { setOpen(!open); setShowAll(false); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/50 mb-1 w-full text-left hover:bg-muted/80 transition-colors cursor-pointer"
            >
                <ChevronRight
                    className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                        open && "rotate-90"
                    )}
                />
                <FolderOpen className="size-4 shrink-0 text-primary/70" />
                <span
                    className="text-[13px] font-medium text-foreground/80 truncate"
                    title={chapter.title}
                >
                    {chapter.title}
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                    {chapter.lessons.length}
                </span>
            </button>


            {open && (
                <div className="ml-2 border-l border-border/40 pl-1">
                    {visibleLessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            href={`/dashboard/${courseSlug}/${lesson.id}`}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors group"
                        >
                            <PlayCircle className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                            <span className="truncate text-[13px]">{lesson.title}</span>
                        </Link>
                    ))}

                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-2 px-3 py-1.5 w-full rounded-md text-xs text-muted-foreground/70 hover:text-foreground hover:bg-accent/30 transition-colors"
                        >
                            <ChevronRight
                                className={cn(
                                    "size-3 shrink-0 transition-transform duration-200",
                                    showAll && "rotate-90"
                                )}
                            />
                            <span>{showAll ? "Show less" : `${hiddenCount} more lesson${hiddenCount > 1 ? "s" : ""}`}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export function CourseSidebar({ course, ...props }: CourseSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5 px-3 pt-1">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    <span className="font-semibold text-[15px]">Learnix</span>
                </div>
            </SidebarHeader>

            <SidebarContent className="pt-3 gap-1">
                {course.chapter.map((chapter, index) => (
                    <ChapterGroup
                        key={chapter.id}
                        chapter={chapter}
                        courseSlug={course.slug}
                        index={index}
                    />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
