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
