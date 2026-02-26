"use client"

import * as React from "react"
import { LayoutDashboard, Compass, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Browse Courses", url: "/courses", icon: Compass },
    { title: "My Learning", url: "/dashboard", icon: BookOpen },
]

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-border/40 px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <Image src="/learnix.webp" alt="Logo" width={128} height={128} className="size-9 object-contain" />
                        <div className="flex flex-col">
                            <span className="text-[17px] font-semibold tracking-tight">Learnix</span>
                            <span className="text-[10px] text-muted-foreground">Student</span>
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
