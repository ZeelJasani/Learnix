"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive area chart"


const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;


interface ChartAreaInteractiveProps {
  data: { date: string; enrollment: number }[];
}




export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollment, 0),
    [data]
  );
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">
              Last 30 days: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={Math.ceil(data.length / 10)} // Show approximately 10 labels
              tickFormatter={(value) => {
                const date = new Date(value);
                // Show date in format like "Aug 15"
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                });
              }}
              tick={{ fontSize: 12 }}
              height={40}
            />


            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px] p-2"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    // Show full date in tooltip like "August 15, 2025"
                    return date.toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }}
                  formatter={(value) => [`${value} enrollments`, '']}
                />
              }
            />


            <Bar
              dataKey="enrollment"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}