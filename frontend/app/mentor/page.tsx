import { api, getAuthToken } from "@/lib/api-client";
import { requireUser } from "@/app/data/user/require-user";
import { BookOpen, DollarSign, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface MentorStats {
    courseCount: number;
    studentCount: number;
    totalRevenue: number;
}

export default async function MentorDashboard() {
    const userData = await requireUser();
    const token = await getAuthToken();

    // Handle both direct user object and wrapped {synced, user} structure
    const user = ('user' in userData ? (userData as any).user : userData);

    // Fetch mentor stats
    const statsResponse = await api.get<MentorStats>(
        "/mentor/dashboard/stats",
        token ?? undefined
    );

    const stats = statsResponse.data || {
        courseCount: 0,
        studentCount: 0,
        totalRevenue: 0,
    };

    return (
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user.name}! Here's your performance overview.
                    </p>
                </div>
            </div>

            <Separator />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Courses"
                    value={stats.courseCount}
                    description="Courses you have created"
                    icon={BookOpen}
                />
                <StatsCard
                    title="Total Students"
                    value={stats.studentCount}
                    description="Students enrolled in your courses"
                    icon={Users}
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${(stats.totalRevenue / 100).toLocaleString()}`}
                    description="Total earnings from your courses"
                    icon={DollarSign}
                />
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
}) {
    return (
        <Card>
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
}
