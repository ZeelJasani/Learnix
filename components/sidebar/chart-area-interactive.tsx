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
  monthName?: string;
}




export function ChartAreaInteractive({ data, monthName }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollment, 0),
    [data]
  );
  return (
    <Card className="@container/card bg-card/50">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-mono">Total Enrollments</CardTitle>
            <CardDescription className="font-mono text-muted-foreground">
              Total: {totalEnrollmentsNumber}
            </CardDescription>
          </div>
          {monthName && (
            <div className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              {monthName}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={0}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.getDate().toString();
              }}
              className="text-xs font-mono text-muted-foreground"
            />

            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
              content={
                <ChartTooltipContent
                  className="w-[180px] font-mono bg-popover/90 backdrop-blur-sm border-border/50"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />

            <Bar
              dataKey="enrollment"
              fill="currentColor"
              className="fill-primary"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}