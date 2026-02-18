"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, User, BookOpen, Clock, Play, Square, Loader2, MoreVertical, AlertCircle } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { toast } from "sonner";
import { CreateSessionDialog } from "./_components/create-session-dialog";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface LiveSession {
    _id: string;
    id?: string;
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [sessionsRes, coursesRes] = await Promise.all([
                fetch("/api/admin/live-sessions"),
                fetch("/api/admin/courses")
            ]);
            const sessionsData = await sessionsRes.json();
            let coursesData = { courses: [] };
            if (coursesRes.ok) {
                const json = await coursesRes.json();
                coursesData = json.data || json;
            }
            if (sessionsData.sessions) setSessions(sessionsData.sessions);
            if (coursesData.courses) setCourses(coursesData.courses);
        } catch {
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleStartSession = async (sessionId: string) => {
        setProcessingId(sessionId);
        try {
            const res = await fetch(`/api/admin/live-sessions/${sessionId}/start`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success("Session started");
            fetchData();
        } catch {
            toast.error("Failed to start session");
        } finally {
            setProcessingId(null);
        }
    };

    const handleEndSession = async (sessionId: string) => {
        if (!confirm("End this session? This cannot be undone.")) return;
        setProcessingId(sessionId);
        try {
            const res = await fetch(`/api/admin/live-sessions/${sessionId}/end`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success("Session ended");
            fetchData();
        } catch {
            toast.error("Failed to end session");
        } finally {
            setProcessingId(null);
        }
    };

    const getId = (session: LiveSession) => session._id || session.id || "";

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "scheduled": return "bg-blue-500/10 text-blue-500";
            case "live": return "bg-red-500/10 text-red-500";
            case "ended": return "bg-muted text-muted-foreground";
            case "cancelled": return "bg-orange-500/10 text-orange-500";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const canStart = (session: LiveSession) => {
        if (session.status !== 'scheduled') return false;
        const start = new Date(session.startsAt);
        return new Date() >= addMinutes(start, -15);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Live Sessions</h1>
                        <p className="text-sm text-muted-foreground">{sessions.length} sessions</p>
                    </div>
                </div>
                <CreateSessionDialog courses={courses} onSessionCreated={fetchData} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-3 rounded-lg bg-muted mb-4">
                        <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No sessions yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create your first live session</p>
                    <CreateSessionDialog courses={courses} onSessionCreated={fetchData} />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sessions.map((session) => {
                        const id = getId(session);
                        return (
                            <Card key={id} className="overflow-hidden border-border/60 hover:border-border transition-colors group">
                                <CardHeader className="p-4 pb-3 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className={cn("text-[10px] font-medium capitalize", getStatusStyle(session.status))}>
                                            {session.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                                            {session.status}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem className="text-destructive text-xs" onClick={() => handleEndSession(id)}>
                                                    Cancel Session
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium line-clamp-2 leading-snug">{session.title}</h3>
                                        <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            {typeof session.courseId === 'object' ? session.courseId.title : 'Unknown'}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 pt-0 space-y-3">
                                    <div className="space-y-1.5 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            <span>{format(new Date(session.startsAt), "EEE, MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            <span>{format(new Date(session.startsAt), "h:mm a")} • {session.durationMinutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            <span className="truncate">{typeof session.hostUserId === 'object' ? session.hostUserId.name : 'Unknown'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm" className="text-xs h-8" asChild>
                                            <a href={`/live/${id}`} target="_blank" rel="noopener noreferrer">
                                                <Video className="h-3 w-3 mr-1" /> Join
                                            </a>
                                        </Button>
                                        {session.status === 'scheduled' && (
                                            <Button size="sm" className="text-xs h-8" onClick={() => handleStartSession(id)} disabled={!canStart(session) || processingId === id}>
                                                {processingId === id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Play className="h-3 w-3 mr-1" /> Start</>}
                                            </Button>
                                        )}
                                        {session.status === 'live' && (
                                            <Button variant="destructive" size="sm" className="text-xs h-8" onClick={() => handleEndSession(id)} disabled={processingId === id}>
                                                {processingId === id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Square className="h-3 w-3 mr-1" /> End</>}
                                            </Button>
                                        )}
                                        {session.status === 'ended' && (
                                            <Button variant="secondary" size="sm" className="text-xs h-8" disabled>Ended</Button>
                                        )}
                                    </div>
                                    {session.status === 'scheduled' && !canStart(session) && (
                                        <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> Available 15 min before
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
