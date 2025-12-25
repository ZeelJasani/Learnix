import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { CoursesAppSidebar } from "./_components/CoursesAppSidebar";
import { HeroHeader } from "@/components/header";

export default function CoursesLayout({ children }: { children: ReactNode }) {
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
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
