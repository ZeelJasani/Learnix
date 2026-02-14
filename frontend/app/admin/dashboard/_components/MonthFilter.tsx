/**
 * DashboardMonthFilter Component — Dashboard stats mate month filter dropdown
 * DashboardMonthFilter Component — Month filter dropdown for dashboard stats
 *
 * Aa client component chhe je URL search params through month-based filtering provide kare chhe
 * This is a client component that provides month-based filtering through URL search params
 *
 * - Select dropdown — January to December months list
 * - URL-based state — ?month=X&year=Y format ma search params update kare chhe
 *   URL-based state — Updates search params in ?month=X&year=Y format
 * - Default values — Current month/year if no search params present
 * - router.push — Page ne re-render kare chhe new params sathe (no full reload)
 *   router.push — Re-renders page with new params (no full reload)
 */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function DashboardMonthFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const selectedMonth = monthParam ? parseInt(monthParam) : currentMonth;
    const selectedYear = yearParam ? parseInt(yearParam) : currentYear;

    const handleMonthChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("month", value);
        if (!params.has("year")) {
            params.set("year", currentYear.toString());
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedMonth.toString()}
                onValueChange={handleMonthChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                            {month}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
