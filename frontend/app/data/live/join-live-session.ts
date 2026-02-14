// Aa file live session join karva mate Stream token ane session details fetch kare chhe
// This file fetches Stream.io token and live session data for joining a live meeting
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { LiveSessionClientData } from "@/components/live/LiveMeetingClient";

export async function joinLiveSession(sessionId: string) {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, message: "Authentication required" } as const;
  }

  const response = await api.post<LiveSessionClientData>(
    `/live-sessions/${sessionId}/join`,
    {},
    token
  );

  return response;
}
