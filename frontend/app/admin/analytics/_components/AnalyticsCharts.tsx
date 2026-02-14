"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts";

interface AnalyticsChartsProps {
    statsByDate: Array<{
        date: string;
        signups: number;
        enrollments: number;
    }>;
}

const chartConfig = {
    signups: {
        label: "Signups",
        color: "hsl(var(--primary))",
    },
    enrollments: {
        label: "Enrollments",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function AnalyticsCharts({ statsByDate }: AnalyticsChartsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>User Growth & Enrollments</CardTitle>
                    <CardDescription>
                        Daily signups and course enrollments for the current month.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <BarChart data={statsByDate}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="enrollments" fill="var(--color-enrollments)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
