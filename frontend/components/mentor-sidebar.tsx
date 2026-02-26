// Aa component mentor panel mate sidebar render kare chhe (Dashboard, My Courses, Students)
// This component renders the mentor panel sidebar with teaching-related navigation and user footer
import * as React from "react"
import { GalleryVerticalEnd, LayoutDashboard, Users, BookOpen, Video, ClipboardCheck, FileQuestion, ListTodo } from "lucide-react"
import Image from "next/image"

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
    SidebarFooter,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

// Mentor navigation data
const data = {
    navMain: [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: "/mentor",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "Teaching",
            items: [
                {
                    title: "Live Sessions",
                    url: "/mentor/live-sessions",
                    icon: Video,
                },
                {
                    title: "My Courses",
                    url: "/mentor/courses",
                    icon: BookOpen,
                },
                {
                    title: "Quizzes",
                    url: "/mentor/quizzes",
                    icon: FileQuestion,
                },
                {
                    title: "Activities",
                    url: "/mentor/activities",
                    icon: ListTodo,
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Submissions",
                    url: "/mentor/submissions",
                    icon: ClipboardCheck,
                },
                {
                    title: "Students",
                    url: "/mentor/students",
                    icon: Users,
                },
            ],
        },
    ],
}

export function MentorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2">
                                <Image src="/learnix.webp" alt="Logo" width={128} height={128} className="size-9 object-contain" />
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-lg tracking-tight">Learnix</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SearchForm />
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} className="flex items-center gap-2">
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
