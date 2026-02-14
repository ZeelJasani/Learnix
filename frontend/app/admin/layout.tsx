/**
 * Admin Layout — Admin panel nu main layout with sidebar navigation
 * Admin Layout — Main layout for admin panel with sidebar navigation
 *
 * Aa layout admin section mate sidebar + header + breadcrumb structure provide kare chhe
 * This layout provides sidebar + header + breadcrumb structure for the admin section
 *
 * Components:
 * - SidebarProvider — Global sidebar state management
 * - AdminSidebar — Admin navigation sidebar (courses, users, mentors, etc.)
 * - SidebarTrigger — Sidebar toggle button (mobile/desktop)
 * - Breadcrumb — "Admin Dashboard" breadcrumb navigation
 * - SidebarInset — Main content area with header and children
 */
import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
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