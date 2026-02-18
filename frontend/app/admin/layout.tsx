import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}