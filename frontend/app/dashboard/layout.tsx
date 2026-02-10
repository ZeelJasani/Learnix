import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-1">
            {/* Main Content - Full Width */}
            <div className="flex-1">{children}</div>
        </div>
    );
}