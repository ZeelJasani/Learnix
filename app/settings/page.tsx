"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Bell, Globe, Moon, Shield, Sun, Monitor, Palette, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { isAdmin } = useUserRole();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [courseUpdates, setCourseUpdates] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [enrollmentAlerts, setEnrollmentAlerts] = useState(true);
    const [paymentAlerts, setPaymentAlerts] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="container mx-auto max-w-4xl py-6 px-4 space-y-8">
            {/* Page Title */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Customize your experience and manage preferences
                </p>
            </div>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Palette className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize how the app looks on your device
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-base">Theme Preference</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme("light")}
                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${theme === "light" ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                            >
                                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Sun className="h-6 w-6 text-amber-600" />
                                </div>
                                <span className="font-medium">Light</span>
                                {theme === "light" && (
                                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                                )}
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                            >
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Moon className="h-6 w-6 text-slate-200" />
                                </div>
                                <span className="font-medium">Dark</span>
                                {theme === "dark" && (
                                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                                )}
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${theme === "system" ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                            >
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-slate-800 flex items-center justify-center">
                                    <Monitor className="h-6 w-6 text-slate-600" />
                                </div>
                                <span className="font-medium">System</span>
                                {theme === "system" && (
                                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                                )}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive important updates via email
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
                            <Label className="text-base">Course Updates</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when enrolled courses have new content
                            </p>
                        </div>
                        <Switch
                            checked={courseUpdates}
                            onCheckedChange={setCourseUpdates}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Promotional Emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive news about new courses and special offers
                            </p>
                        </div>
                        <Switch
                            checked={marketingEmails}
                            onCheckedChange={setMarketingEmails}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Admin Notifications - Only visible to admins */}
            {isAdmin && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle>Admin Notifications</CardTitle>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                        Admin Only
                                    </span>
                                </div>
                                <CardDescription>
                                    Configure admin-specific notification settings
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">New Enrollment Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when users enroll in your courses
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
                                <Label className="text-base">Payment Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified for successful and failed payments
                                </p>
                            </div>
                            <Switch
                                checked={paymentAlerts}
                                onCheckedChange={setPaymentAlerts}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Language & Region */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Language & Region</CardTitle>
                            <CardDescription>
                                Set your preferred language and regional settings
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">🇺🇸 English</SelectItem>
                                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                                    <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select defaultValue="asia-kolkata">
                                <SelectTrigger className="w-full">
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

            {/* Privacy & Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Privacy & Security</CardTitle>
                            <CardDescription>
                                Manage your privacy and data settings
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Profile Visibility</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow other users to see your profile
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Learning Progress</Label>
                            <p className="text-sm text-muted-foreground">
                                Share your learning progress publicly
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            Configure
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4 pb-8">
                <Button variant="outline" asChild>
                    <Link href="/profile">Cancel</Link>
                </Button>
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
