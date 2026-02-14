"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, User, BookOpen, Clock, Play, Square, Loader2, MoreVertical, AlertCircle } from "lucide-react";
import { format, isPast, addMinutes } from "date-fns";
import { toast } from "sonner";
import { CreateSessionDialog } from "./_components/create-session-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface LiveSession {
    _id: string; // Backend uses _id
    id?: string; // Sometimes id
    title: string;
    description: string;
    startsAt: string;
    durationMinutes: number;
    status: string;
    courseId: { title: string } | string;
    hostUserId: { name: string; email: string } | string;
}

interface Course {
    _id: string;
    title: string;
}

export default function AdminLiveSessionsPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Data fetch karva mate
    // To fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Parallel fetch
            const [sessionsRes, coursesRes] = await Promise.all([
                fetch("/api/admin/live-sessions"),
                fetch("/api/admin/courses")
            ]);

            const sessionsData = await sessionsRes.json();

            // Handle courses fetch - might need adjustment based on real API
            let coursesData = { courses: [] };
            if (coursesRes.ok) {
                const json = await coursesRes.json();
                coursesData = json.data || json; // Handle different response structures
            }

            if (sessionsData.sessions) {
                setSessions(sessionsData.sessions);
            }

            if (coursesData.courses) {
                setCourses(coursesData.courses);
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Session start karva mate
    // To start a session
    const handleStartSession = async (sessionId: string) => {
        setProcessingId(sessionId);
        try {
            const res = await fetch(`/api/admin/live-sessions/${sessionId}/start`, {
                method: "POST"
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Session started successfully");
            fetchData(); // Refresh list
        } catch (error) {
            toast.error("Failed to start session");
        } finally {
            setProcessingId(null);
        }
    };

    // Session end karva mate
    // To end a session
    const handleEndSession = async (sessionId: string) => {
        if (!confirm("Are you sure you want to end this session? This action cannot be undone.")) return;

        setProcessingId(sessionId);
        try {
            const res = await fetch(`/api/admin/live-sessions/${sessionId}/end`, {
                method: "POST"
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Session ended successfully");
            fetchData(); // Refresh list
        } catch (error) {
            toast.error("Failed to end session");
        } finally {
            setProcessingId(null);
        }
    };

    // Helper to extract ID
    const getId = (session: LiveSession) => session._id || session.id || "";

    // Status pramaane color melavva mate
    // To get color based on status
    const getStatusInfo = (status: string) => {
        switch (status) {
            case "scheduled": return { color: "bg-blue-500/10 text-blue-500 border-blue-200", label: "Scheduled" };
            case "live": return { color: "bg-red-500/10 text-red-500 border-red-200 animate-pulse", label: "Live Now" };
            case "ended": return { color: "bg-gray-500/10 text-gray-500 border-gray-200", label: "Ended" };
            case "cancelled": return { color: "bg-orange-500/10 text-orange-500 border-orange-200", label: "Cancelled" };
            default: return { color: "bg-gray-500/10 text-gray-500", label: status };
        }
    };

    const canStart = (session: LiveSession) => {
        if (session.status !== 'scheduled') return false;
        const start = new Date(session.startsAt);
        const now = new Date();
        // Allow start 15 mins before
        const fifteenMinsBefore = addMinutes(start, -15);
        return now >= fifteenMinsBefore;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        Live Sessions
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Manage and monitor real-time interactive classrooms
                    </p>
                </div>
                <CreateSessionDialog courses={courses} onSessionCreated={fetchData} />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground font-medium">Loading sessions...</p>
                </div>
            ) : sessions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20"
                >
                    <div className="rounded-full bg-primary/5 p-6 mb-6 ring-1 ring-primary/10">
                        <Video className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-bold text-2xl mb-3">No live sessions scheduled</h3>
                    <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                        Create your first live session to start interacting with your students in real-time video classrooms.
                    </p>
                    <CreateSessionDialog courses={courses} onSessionCreated={fetchData} />
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    <AnimatePresence>
                        {sessions.map((session) => {
                            const id = getId(session);
                            const statusInfo = getStatusInfo(session.status);

                            return (
                                <motion.div key={id} variants={item} layout>
                                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group">
                                        <CardHeader className="bg-muted/30 pb-4 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 border shadow-sm", statusInfo.color)}>
                                                    {statusInfo.label}
                                                </Badge>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleEndSession(id)}>
                                                            Cancel Session
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div>
                                                <CardTitle className="text-xl leading-tight line-clamp-2 h-[3.5rem]" title={session.title}>
                                                    {session.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground bg-background/80 w-fit px-2 py-1 rounded-md border">
                                                    <BookOpen className="h-3 w-3" />
                                                    <span className="truncate max-w-[200px]">
                                                        {typeof session.courseId === 'object' ? session.courseId.title : 'Unknown Course'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-6 flex flex-col h-[calc(100%-140px)] justify-between gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="p-1.5 bg-primary/5 rounded-md">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-foreground">
                                                        {format(new Date(session.startsAt), "EEE, MMM d, yyyy")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="p-1.5 bg-primary/5 rounded-md">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span>
                                                        {format(new Date(session.startsAt), "h:mm a")} • {session.durationMinutes} min
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="p-1.5 bg-primary/5 rounded-md">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="truncate">
                                                        {typeof session.hostUserId === 'object' ? session.hostUserId.name : 'Unknown Host'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-4 mt-auto space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {/* Join Button (Always visible for Admin) */}
                                                    <Button
                                                        className="w-full font-semibold shadow-sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <a href={`/live/${id}`} target="_blank" rel="noopener noreferrer">
                                                            <Video className="h-4 w-4 mr-2" />
                                                            Join
                                                        </a>
                                                    </Button>

                                                    {/* Start Button */}
                                                    {session.status === 'scheduled' && (
                                                        <Button
                                                            className="w-full shadow-md font-semibold"
                                                            variant="default"
                                                            onClick={() => handleStartSession(id)}
                                                            disabled={!canStart(session) || processingId === id}
                                                        >
                                                            {processingId === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                                                            Start
                                                        </Button>
                                                    )}

                                                    {/* End Button */}
                                                    {session.status === 'live' && (
                                                        <Button
                                                            className="w-full shadow-lg shadow-red-500/20"
                                                            variant="destructive"
                                                            onClick={() => handleEndSession(id)}
                                                            disabled={processingId === id}
                                                        >
                                                            {processingId === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4 mr-2" />}
                                                            End
                                                        </Button>
                                                    )}
                                                </div>

                                                {session.status === 'scheduled' && !canStart(session) && (
                                                    <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Start available 15 min before
                                                    </p>
                                                )}

                                                {session.status === 'ended' && (
                                                    <Button className="w-full opacity-80" variant="secondary" disabled>
                                                        Session Ended
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
