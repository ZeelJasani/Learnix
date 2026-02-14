/**
 * Courses Layout — Course browsing pages nu sidebar layout
 * Courses Layout — Sidebar layout for course browsing pages
 *
 * Aa layout sidebar + header + breadcrumb structure provide kare chhe courses section mate
 * This layout provides sidebar + header + breadcrumb structure for the courses section
 *
 * Components:
 * - DashboardSidebar — Navigation sidebar with collapsible support
 * - SidebarTrigger — Mobile/desktop sidebar toggle button
 * - Breadcrumb — "Browse Courses" breadcrumb navigation
 * - SidebarInset — Main content area with header and children rendering
 */
import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function CoursesLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Browse Courses</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
