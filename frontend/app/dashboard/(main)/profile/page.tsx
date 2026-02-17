import { requireUser } from "@/app/data/user/require-user";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const user = await requireUser();
    const enrolledCourses = await getEnrolledCourses();

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
        <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
            {/* Profile Header */}
            <Card className="border-border/60">
                <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                            <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-semibold">{user.name}</h1>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3" />
                                {user.email}
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="https://accounts.clerk.com/user" target="_blank">
                                <ExternalLink className="h-3 w-3 mr-1.5" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-3">
                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Courses</CardTitle>
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{enrolledCourses.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Status</CardTitle>
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Member Since</CardTitle>
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">{memberSince}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Details */}
            <Card className="border-border/60">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                            <p className="text-sm">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Account ID</p>
                            <p className="text-xs font-mono text-muted-foreground">{user.id.slice(0, 16)}...</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Verified</p>
                            <p className="text-sm">
                                {user.emailVerified ? (
                                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Verified</span>
                                ) : (
                                    <span className="text-yellow-600">Pending</span>
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
