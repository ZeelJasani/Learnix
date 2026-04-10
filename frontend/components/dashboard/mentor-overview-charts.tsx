"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RevenueData {
  month: string;
  revenue: number;
}

interface CoursePerformance {
  title: string;
  students: number;
}

interface MentorOverviewChartsProps {
  revenueTrend: RevenueData[];
  coursePerformance: CoursePerformance[];
}

export function MentorOverviewCharts({
  revenueTrend,
  coursePerformance,
}: MentorOverviewChartsProps) {
  // Premium Color Palette
  const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#ef4444", "#f59e0b"];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Trend Chart */}
      <Card className="col-span-1 border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
          <CardDescription>Monthly earnings growth (Last 6 months)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#818cf8" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Course Performance Chart */}
      <Card className="col-span-1 border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Performing Courses</CardTitle>
          <CardDescription>Total enrollments per course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="title" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={100}
                />
                <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#a855f7" }}
                />
                <Bar dataKey="students" radius={[0, 4, 4, 0]}>
                  {coursePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
