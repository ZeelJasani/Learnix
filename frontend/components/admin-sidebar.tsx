"use client"

import * as React from "react"
import { LayoutDashboard, Users, BookOpen, Activity, GraduationCap, Video, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const navItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Mentors", url: "/admin/mentors", icon: GraduationCap },
    { title: "Courses", url: "/admin/courses", icon: BookOpen },
    { title: "Lessons", url: "/admin/lessons", icon: FileText },
    { title: "Activities", url: "/admin/activities", icon: Activity },
    { title: "Live Sessions", url: "/admin/live-sessions", icon: Video },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-border/40 px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                            L
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">Learnix</span>
                            <span className="text-[10px] text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>
                    <SidebarTrigger className="size-7" />
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-3">
                <SidebarMenu className="gap-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={cn(
                                        "h-9 rounded-lg transition-colors",
                                        isActive && "bg-muted font-medium"
                                    )}
                                >
                                    <Link href={item.url} className="flex items-center gap-2.5 px-2.5">
                                        <item.icon className="size-4 shrink-0" />
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-border/40">
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
