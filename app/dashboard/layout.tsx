import { CoursesAppSidebar } from "@/app/(public)/courses/_components/CoursesAppSidebar";
import { HeroHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeroHeader />
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 56)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <CoursesAppSidebar variant="inset" />
                <SidebarInset>
                    <div className="flex flex-1 flex-col pt-16">
                        <div className="@container/main flex flex-1 flex-col">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}