"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Bell, Globe, Moon, Shield, Sun, Monitor, Settings } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [enrollmentAlerts, setEnrollmentAlerts] = useState(true);
    const [paymentAlerts, setPaymentAlerts] = useState(true);
    const [weeklyReports, setWeeklyReports] = useState(true);

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Admin Settings</h1>
                <p className="text-muted-foreground">
                    Manage platform settings and admin preferences
                </p>
            </div>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                        Customize how the admin dashboard looks
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Button
                                variant={theme === "light" ? "default" : "outline"}
                                className="flex flex-col items-center gap-2 h-auto py-4"
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-5 w-5" />
                                <span>Light</span>
                            </Button>
                            <Button
                                variant={theme === "dark" ? "default" : "outline"}
                                className="flex flex-col items-center gap-2 h-auto py-4"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-5 w-5" />
                                <span>Dark</span>
                            </Button>
                            <Button
                                variant={theme === "system" ? "default" : "outline"}
                                className="flex flex-col items-center gap-2 h-auto py-4"
                                onClick={() => setTheme("system")}
                            >
                                <Monitor className="h-5 w-5" />
                                <span>System</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Admin Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Admin Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Configure admin-specific notification settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive all admin notifications via email
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>New Enrollment Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when users enroll in courses
                            </p>
                        </div>
                        <Switch
                            checked={enrollmentAlerts}
                            onCheckedChange={setEnrollmentAlerts}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Payment Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified for successful and failed payments
                            </p>
                        </div>
                        <Switch
                            checked={paymentAlerts}
                            onCheckedChange={setPaymentAlerts}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive weekly analytics summary via email
                            </p>
                        </div>
                        <Switch
                            checked={weeklyReports}
                            onCheckedChange={setWeeklyReports}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Platform Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        <CardTitle>Platform Settings</CardTitle>
                    </div>
                    <CardDescription>
                        Configure platform-wide settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Default Course Level</Label>
                            <Select defaultValue="beginner">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>New Course Status</Label>
                            <Select defaultValue="draft">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Require Email Verification</Label>
                            <p className="text-sm text-muted-foreground">
                                Users must verify email before enrolling
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <CardTitle>Language & Region</CardTitle>
                    </div>
                    <CardDescription>
                        Set your preferred language and regional settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Español</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="de">Deutsch</SelectItem>
                                    <SelectItem value="hi">हिंदी</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select defaultValue="asia-kolkata">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                                    <SelectItem value="america-new_york">America/New York (EST)</SelectItem>
                                    <SelectItem value="america-los_angeles">America/Los Angeles (PST)</SelectItem>
                                    <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                                    <SelectItem value="utc">UTC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>
                        Manage security and access settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Add extra security to your admin account
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            Configure
                        </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Session Timeout</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically log out after inactivity
                            </p>
                        </div>
                        <Select defaultValue="60">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button size="lg">Save Changes</Button>
            </div>
        </div>
    );
}
