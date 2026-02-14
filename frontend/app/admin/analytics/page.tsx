import { getAnalyticsData } from "@/app/data/admin/get-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { AnalyticsCharts } from "./_components/AnalyticsCharts";
import { Users, CreditCard, Activity, BookOpen } from "lucide-react";

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    if (!data) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                <p>Failed to load analytics data.</p>
            </div>
        );
    }

    const { dashboard, enrollment } = data;

    if (!dashboard || !enrollment) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Analytics</h1>
                <p>Failed to load complete analytics data.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Overview of your platform's performance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(enrollment.revenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            + {dashboard.recentSignups} this month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{enrollment.activeEnrollments}</div>
                        <p className="text-xs text-muted-foreground">
                            {enrollment.totalEnrollments} total enrollments
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            {dashboard.totalLessons} total lessons
                        </p>
                    </CardContent>
                </Card>
            </div>

            <AnalyticsCharts statsByDate={dashboard.statsByDate} />
        </div>
    );
}
