"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Bell, Globe, Moon, Shield, Sun, Monitor } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [courseUpdates, setCourseUpdates] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account preferences and settings
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
                        Customize how the app looks on your device
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

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Configure how you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
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
                            <Label>Course Updates</Label>
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
                            <Label>Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive news about new courses and promotions
                            </p>
                        </div>
                        <Switch
                            checked={marketingEmails}
                            onCheckedChange={setMarketingEmails}
                        />
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

            {/* Privacy */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Privacy</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your privacy and data settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Profile Visibility</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow other users to see your profile
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Learning Progress</Label>
                            <p className="text-sm text-muted-foreground">
                                Share your learning progress publicly
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button size="lg">Save Changes</Button>
            </div>
        </div>
    );
}
