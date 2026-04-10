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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GrowthData {
  date: string;
  signups: number;
  enrollments: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface CategoryData {
  category: string;
  revenue: number;
}

interface AdminOverviewChartsProps {
  growthData: GrowthData[];
  revenueTrend: RevenueData[];
  categoryPerformance: CategoryData[];
}

export function AdminOverviewCharts({
  growthData,
  revenueTrend,
  categoryPerformance,
}: AdminOverviewChartsProps) {
  // Premium Color Palette
  const GROWTH_COLORS = { signups: "#6366f1", enrollments: "#10b981" };
  const REVENUE_COLOR = "#a855f7";
  const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Growth Trends - Full Width on 2nd row or combined */}
        <Card className="md:col-span-2 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Growth</CardTitle>
            <CardDescription>Daily Signups vs Enrollments (Selected Month)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(val) => val.split("-")[2]} // Just show day
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px", color: "#fff" }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line 
                    name="Signups"
                    type="monotone" 
                    dataKey="signups" 
                    stroke={GROWTH_COLORS.signups} 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    name="Enrollments"
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke={GROWTH_COLORS.enrollments} 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Share - Donut */}
        <Card className="col-span-1 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Revenue</CardTitle>
            <CardDescription>Top niches by earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="revenue"
                    nameKey="category"
                  >
                    {categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Revenue Trend - Wide */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Global Platform Revenue</CardTitle>
          <CardDescription>Combined earnings trend for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={REVENUE_COLOR} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0} />
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
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={REVENUE_COLOR}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAdminRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
