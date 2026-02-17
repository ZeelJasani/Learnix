"use client"

import * as React from "react"
import { useState } from "react"
import { PlayCircle, ChevronRight, FolderOpen } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavUser } from "@/components/nav-user"

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
    course: SidebarCourse
}

const DEFAULT_VISIBLE = 3

function ChapterGroup({ chapter, courseSlug }: {
    chapter: SidebarCourse["chapter"][number];
    courseSlug: string;
}) {
    const [open, setOpen] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const hasMore = chapter.lessons.length > DEFAULT_VISIBLE
    const visibleLessons = showAll ? chapter.lessons : chapter.lessons.slice(0, DEFAULT_VISIBLE)
    const hiddenCount = chapter.lessons.length - DEFAULT_VISIBLE

    return (
        <div className="px-3 mb-0.5">
            <button
                onClick={() => { setOpen(!open); setShowAll(false); }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-muted/50 w-full text-left transition-colors cursor-pointer"
            >
                <ChevronRight
                    className={cn(
                        "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
                        open && "rotate-90"
                    )}
                />
                <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium truncate" title={chapter.title}>
                    {chapter.title}
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                    {chapter.lessons.length}
                </span>
            </button>

            {open && (
                <div className="ml-3 border-l border-border/40 pl-1">
                    {visibleLessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            href={`/dashboard/${courseSlug}/${lesson.id}`}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group"
                        >
                            <PlayCircle className="size-3 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <span className="truncate">{lesson.title}</span>
                        </Link>
                    ))}

                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-2 px-2.5 py-1.5 w-full rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                        >
                            <ChevronRight
                                className={cn(
                                    "size-2.5 shrink-0 transition-transform duration-200",
                                    showAll && "rotate-90"
                                )}
                            />
                            <span>{showAll ? "Show less" : `${hiddenCount} more`}</span>
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
            <SidebarHeader className="border-b border-border/40 px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                            L
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">Learnix</span>
                            <span className="text-[10px] text-muted-foreground">Course</span>
                        </div>
                    </Link>
                    <SidebarTrigger className="size-7" />
                </div>
            </SidebarHeader>

            <SidebarContent className="pt-3 gap-0.5">
                <div className="px-3 mb-2">
                    <Link
                        href={`/dashboard/${course.slug}`}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted font-medium text-sm transition-colors"
                    >
                        Course Overview
                    </Link>
                </div>

                {course.chapter.map((chapter) => (
                    <ChapterGroup
                        key={chapter.id}
                        chapter={chapter}
                        courseSlug={course.slug}
                    />
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t border-border/40">
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
