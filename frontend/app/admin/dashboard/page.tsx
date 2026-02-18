import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-state";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { AdminCourseCard } from "../courses/_components/AdminCourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ShoppingCart, Users, AlignLeft, ArrowRight } from "lucide-react";
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

  const month = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month as string) : currentMonth;
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year as string) : currentYear;

  const [stats, recentCourses] = await Promise.all([
    adminGetDashboardStats(month, year),
    adminGetRecentCourses(),
  ]);

  const statCards = [
    {
      title: "Total Signups",
      value: stats.totalSignups,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: ShoppingCart,
      href: "/admin/users",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      title: "Total Lessons",
      value: stats.totalLessons,
      icon: AlignLeft,
      href: "/admin/lessons",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="group hover:border-primary/30 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <stat.icon className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Courses</h2>
          <div className="flex items-center gap-3">
            <DashboardMonthFilter />
            <Link
              href="/admin/courses"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recentCourses.map((course) => (
            // @ts-ignore
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
