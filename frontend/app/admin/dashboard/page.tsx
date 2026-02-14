/**
 * Admin Dashboard Page — Platform overview ane statistics page
 * Admin Dashboard Page — Platform overview and statistics page
 *
 * Aa server component chhe je admin dashboard display kare chhe month-based filtering sathe
 * This is a server component that displays the admin dashboard with month-based filtering
 *
 * Features:
 * - requireAdmin() — Admin access guard
 * - DashboardMonthFilter — URL search params based month/year filter
 * - Stats grid (4 cards) — Total Signups, Customers, Courses, Lessons
 *   — StatsCard helper component — Clickable card je admin sub-page par navigate kare chhe
 *   — StatsCard helper component — Clickable card that navigates to admin sub-pages
 * - Recent courses section — adminGetRecentCourses() thi latest courses display kare chhe
 *   Recent courses section — Displays latest courses via adminGetRecentCourses()
 * - Parallel data fetching — Promise.all for stats + recentCourses
 */
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-state";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { AdminCourseCard } from "../courses/_components/AdminCourseCard";
// import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ShoppingCart, Users, AlignLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DashboardMonthFilter } from "./_components/MonthFilter";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireAdmin();

  const resolvedSearchParams = await searchParams;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Default to current month/year if not specified
  const month = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month as string) : currentMonth;
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year as string) : currentYear;

  // Fetch data in parallel for performance
  const [stats, recentCourses] = await Promise.all([
    adminGetDashboardStats(month, year),
    adminGetRecentCourses(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your platform's performance
          </p>
        </div>
        <DashboardMonthFilter />
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Signups"
          value={stats.totalSignups}
          description="Registered users on the platform"
          icon={Users}
          href="/admin/users"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Users who have enrolled in courses"
          icon={ShoppingCart}
          href="/admin/users"
        />
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          description="Available courses on the platform"
          icon={BookOpen}
          href="/admin/courses"
        />
        <StatsCard
          title="Total Lessons"
          value={stats.totalLessons}
          description="Total learning material available"
          icon={AlignLeft}
          href="/admin/lessons"
        />

      </div>

      {/* Charts & Activity */}
      {/* <div className="grid gap-4 md:grid-cols-1">
        <ChartAreaInteractive
          data={stats.statsByDate.map(s => ({ date: s.date, enrollment: s.enrollments }))}
          monthName={new Date(year, month).toLocaleString('default', { month: 'long' })}
        />
      </div> */}

      {/* Recent Courses */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Recent Courses</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {recentCourses.map((course) => (
            // @ts-ignore
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  description: string;
  icon: any;
  href?: string;
}) {
  const content = (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
