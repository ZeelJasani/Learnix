/**
 * LiveMeetingClient — Live session nu main meeting container (Setup → Room flow)
 * LiveMeetingClient — Main meeting container for live session (Setup → Room flow)
 *
 * Features:
 * - StreamCall + StreamTheme — Stream SDK call wrapper with theming
 * - MeetingSetup → MeetingRoom — Two-phase flow (device setup pahela, poi meeting)
 *   MeetingSetup → MeetingRoom — Two-phase flow (device setup first, then meeting)
 * - LiveSessionClientData interface — Session data structure for client-side
 * - useStreamVideoClient() thi call object create thay chhe session.streamCallId sathe
 *   Call object created via useStreamVideoClient() with session.streamCallId
 */
"use client";

import { useEffect, useState } from "react";
import {
  Call,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";

import LiveLoader from "./LiveLoader";
import MeetingSetup from "./MeetingSetup";
import MeetingRoom from "./MeetingRoom";

export interface LiveSessionClientData {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string;
  status: string;
  streamCallId: string;
  streamCallType: string;
}

export default function LiveMeetingClient({ session }: { session: LiveSessionClientData }) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (!client || !session?.streamCallId) return;

    const nextCall = client.call(session.streamCallType, session.streamCallId);
    setCall(nextCall);
  }, [client, session]);

  if (!client || !call) {
    return <LiveLoader />;
  }

  return (
    <main className="h-screen w-full bg-background text-foreground">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom sessionId={session.id} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
