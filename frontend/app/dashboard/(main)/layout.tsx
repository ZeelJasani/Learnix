import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function MainDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
