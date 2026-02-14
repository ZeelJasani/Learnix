/**
 * CourseLiveSessions Component — Course na live sessions manage ane join karva mate
 * CourseLiveSessions Component — For managing and joining course live sessions
 *
 * Aa client component chhe je live video sessions nu full CRUD + join functionality provide kare chhe
 * This is a client component that provides full CRUD + join functionality for live video sessions
 *
 * Features:
 * - Session groups — Live Now, Upcoming, ane Past sections ma categorized
 *   Session groups — Categorized into Live Now, Upcoming, and Past sections
 * - Schedule dialog — Admin/Mentor ne session create karva de chhe (title, description, time, duration)
 *   Schedule dialog — Allows Admin/Mentor to create sessions (title, description, time, duration)
 * - Start/End controls — canManage=true hoy tyare admin start/end buttons display thay chhe
 *   Start/End controls — Admin start/end buttons displayed when canManage=true
 * - Join button — Enrolled students 10 min early thi session join kari sake chhe
 *   Join button — Enrolled students can join 10 min before start time
 * - Status badges — Live (green), Scheduled (outline), Ended (secondary)
 * - API calls — /live-sessions/course/{slug} (GET), /live-sessions (POST), start/end (POST)
 * - Clerk auth — useAuth() thi Bearer token for API authentication
 *   Clerk auth — Bearer token via useAuth() for API authentication
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Calendar, Video, Radio, PlayCircle, StopCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const JOIN_WINDOW_MINUTES = 10;

type LiveSession = {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string;
  durationMinutes?: number | null;
  status: "scheduled" | "live" | "ended" | "cancelled";
  streamCallId: string;
  streamCallType: string;
  hostUserId: string;
  hostClerkId: string;
  endedAt?: string | null;
};

type LiveSessionsResponse = {
  sessions: LiveSession[];
  canManage: boolean;
  isEnrolled: boolean;
};

export function CourseLiveSessions({ slug }: { slug: string }) {
  const { getToken } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    startsAt: "",
    durationMinutes: "",
  });

  const fetchSessions = useCallback(async () => {
    if (!API_URL) {
      toast.error("NEXT_PUBLIC_API_URL is missing");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/live-sessions/course/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to load live sessions");
      }

      const data = result.data as LiveSessionsResponse;
      setSessions(data.sessions || []);
      setCanManage(Boolean(data.canManage));
      setIsEnrolled(Boolean(data.isEnrolled));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to load live sessions");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, slug]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const grouped = useMemo(() => {
    const now = new Date();
    const live = sessions.filter((s) => s.status === "live");
    const upcoming = sessions.filter(
      (s) => s.status === "scheduled" && new Date(s.startsAt) > now
    );
    const past = sessions.filter(
      (s) =>
        s.status === "ended" ||
        (s.status === "scheduled" && new Date(s.startsAt) <= now)
    );
    return { live, upcoming, past };
  }, [sessions]);

  const handleCreate = async () => {
    if (!API_URL) {
      toast.error("NEXT_PUBLIC_API_URL is missing");
      return;
    }
    if (!formValues.title || !formValues.startsAt) {
      toast.error("Title and start time are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const payload = {
        courseIdOrSlug: slug,
        title: formValues.title,
        description: formValues.description || undefined,
        startsAt: new Date(formValues.startsAt).toISOString(),
        durationMinutes: formValues.durationMinutes
          ? Number(formValues.durationMinutes)
          : undefined,
      };

      const response = await fetch(`${API_URL}/live-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to create session");
      }

      toast.success("Live session scheduled");
      setFormValues({
        title: "",
        description: "",
        startsAt: "",
        durationMinutes: "",
      });
      setIsDialogOpen(false);
      fetchSessions();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSession = async (sessionId: string, action: "start" | "end") => {
    if (!API_URL) {
      toast.error("NEXT_PUBLIC_API_URL is missing");
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_URL}/live-sessions/${sessionId}/${action}`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to update session");
      }
      fetchSessions();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update session");
    }
  };

  const renderSessionCard = (session: LiveSession) => {
    const startsAt = new Date(session.startsAt);
    const joinWindow = new Date(startsAt.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000);
    const now = new Date();
    const canJoin =
      session.status === "live" || (session.status === "scheduled" && now >= joinWindow);

    const statusBadge =
      session.status === "live" ? (
        <Badge className="bg-emerald-500 text-white">Live</Badge>
      ) : session.status === "ended" ? (
        <Badge variant="secondary">Ended</Badge>
      ) : (
        <Badge variant="outline">Scheduled</Badge>
      );

    return (
      <Card key={session.id} className="border">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{session.title}</CardTitle>
            {session.description && (
              <p className="text-sm text-muted-foreground">{session.description}</p>
            )}
          </div>
          {statusBadge}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {startsAt.toLocaleString()}
            </div>
            {session.durationMinutes ? (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {session.durationMinutes} min
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {canManage && session.status === "scheduled" && (
              <Button
                variant="outline"
                onClick={() => updateSession(session.id, "start")}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Start now
              </Button>
            )}
            {canManage && session.status === "live" && (
              <Button
                variant="destructive"
                onClick={() => updateSession(session.id, "end")}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                End session
              </Button>
            )}

            {isEnrolled && session.status !== "ended" && (
              canJoin ? (
                <Button asChild className="min-w-[140px]">
                  <Link href={`/live/${session.id}`}>
                    <Radio className="mr-2 h-4 w-4" />
                    Join session
                  </Link>
                </Button>
              ) : (
                <Button disabled className="min-w-[140px]">
                  <Radio className="mr-2 h-4 w-4" />
                  Not started
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading live sessions...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Live Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Join scheduled live classes for this course.
          </p>
        </div>

        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Schedule Session</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a live session</DialogTitle>
                <DialogDescription>
                  Add a title, optional description, and start time.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Session title"
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <Textarea
                  placeholder="Session description (optional)"
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Input
                  type="datetime-local"
                  value={formValues.startsAt}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      startsAt: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  min={10}
                  placeholder="Duration (minutes, optional)"
                  value={formValues.durationMinutes}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      durationMinutes: e.target.value,
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting ? "Scheduling..." : "Schedule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {grouped.live.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Live Now
          </h3>
          <div className="grid gap-4">{grouped.live.map(renderSessionCard)}</div>
        </div>
      )}

      {grouped.upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Upcoming
          </h3>
          <div className="grid gap-4">{grouped.upcoming.map(renderSessionCard)}</div>
        </div>
      )}

      {grouped.past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Past Sessions
          </h3>
          <div className="grid gap-4">{grouped.past.map(renderSessionCard)}</div>
        </div>
      )}

      {sessions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No live sessions scheduled yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
