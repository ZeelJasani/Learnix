/**
 * Live Session Page — Individual live session ma join kari ne meeting render kare chhe
 * Live Session Page — Joins individual live session and renders the meeting
 *
 * Aa server component chhe je joinLiveSession() call kare chhe for SSR enrollment + Stream member add
 * This is a server component that calls joinLiveSession() for SSR enrollment + Stream member add
 *
 * Flow:
 * 1. SSR par joinLiveSession(sessionId) — Backend /live-sessions/:id/join call
 * 2. Success → LiveMeetingClient render (Setup → Room flow)
 * 3. Failure → LiveCallAlert with error message ane "Back to Dashboard" button
 */
import LiveMeetingClient from "@/components/live/LiveMeetingClient";
import LiveCallAlert from "@/components/live/LiveCallAlert";
import { joinLiveSession } from "@/app/data/live/join-live-session";

interface LiveSessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function LiveSessionPage({ params }: LiveSessionPageProps) {
  const { sessionId } = await params;
  const response = await joinLiveSession(sessionId);

  if (!response?.success || !response.data) {
    return (
      <LiveCallAlert
        title={response?.message || "Unable to join live session"}
        description="Please check your enrollment or try again later."
      />
    );
  }

  return <LiveMeetingClient session={response.data} />;
}
