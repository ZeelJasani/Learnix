/**
 * Dashboard Root Layout — Student dashboard nu top-level layout wrapper
 * Dashboard Root Layout — Top-level layout wrapper for student dashboard
 *
 * Aa layout component chhe je dashboard na badha pages ne flex container ma wrap kare chhe
 * This layout component wraps all dashboard pages in a flex container
 *
 * Structure:
 * - flex flex-1 — Full width horizontal flex container
 * - Children render thay chhe main content area ma
 *   Children render in the main content area
 */
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-1">
            {/* Main Content - Full Width */}
            <div className="flex-1">{children}</div>
        </div>
    );
}