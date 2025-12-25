import { requireAdmin } from "@/app/data/admin/require-admin";
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Mail, Shield, Users, Layers, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminProfilePage() {
    const { user } = await requireAdmin();
    const stats = await adminGetDashboardStats();

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Admin Profile</h1>
                <p className="text-muted-foreground">
                    View your admin account information and statistics
                </p>
            </div>

            {/* Profile Card */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                                <Shield className="h-4 w-4 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Administrator
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="https://accounts.clerk.com/user" target="_blank">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Admin Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            courses created
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            enrolled users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLessons}</div>
                        <p className="text-xs text-muted-foreground">
                            lessons published
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{memberSince}</div>
                        <p className="text-xs text-muted-foreground">
                            account created
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Account Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Your administrator account information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                </label>
                                <p className="text-sm font-medium">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Address
                                </label>
                                <p className="text-sm font-medium">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Role
                                </label>
                                <p className="text-sm font-medium capitalize">{user.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Verified
                                </label>
                                <p className="text-sm font-medium">
                                    {user.emailVerified ? (
                                        <span className="text-green-600">✓ Verified</span>
                                    ) : (
                                        <span className="text-yellow-600">Pending</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
