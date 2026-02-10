import * as React from "react"
import { GalleryVerticalEnd, BookOpen, CheckCircle, Circle, PlayCircle } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data"
import Link from "next/link"

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
    course: SidebarCourse
}

export function CourseSidebar({ course, ...props }: CourseSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold line-clamp-1">{course.title}</span>
                                    <span className="">{course.category}</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SearchForm />
            </SidebarHeader>
            <SidebarContent>
                {course.chapter.map((chapter) => (
                    <SidebarGroup key={chapter.id}>
                        <SidebarGroupLabel title={chapter.title} className="truncate">
                            {chapter.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {chapter.lessons.map((lesson) => (
                                    <SidebarMenuItem key={lesson.id}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={`/dashboard/${course.slug}/lesson/${lesson.id}`}
                                                className="flex items-center gap-2"
                                            >
                                                {/* Simple icon logic - can be expanded for progress */}
                                                <PlayCircle className="size-4 shrink-0" />
                                                <span className="truncate">{lesson.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
