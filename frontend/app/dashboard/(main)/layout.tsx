/**
 * Main Dashboard Layout — Sidebar + header + content area sathe student dashboard layout
 * Main Dashboard Layout — Student dashboard layout with sidebar + header + content area
 *
 * Aa layout component chhe je (main) route group na pages ne sidebar ane breadcrumb header sathe render kare chhe
 * This layout renders pages in the (main) route group with sidebar and breadcrumb header
 *
 * Features:
 * - SidebarProvider + DashboardSidebar — Collapsible navigation sidebar
 * - SidebarInset — Main content area adjacent to sidebar
 * - Header — SidebarTrigger + Separator + Breadcrumb ("Student Dashboard")
 * - Responsive — Sidebar collapses to icon mode on small screens
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
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function MainDashboardLayout({ children }: { children: ReactNode }) {
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
                                    <BreadcrumbPage>Student Dashboard</BreadcrumbPage>
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
