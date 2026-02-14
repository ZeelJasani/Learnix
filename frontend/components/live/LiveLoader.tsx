/**
 * LiveLoader — Live session loading state indicator with spinner ane label
 * LiveLoader — Live session loading state indicator with spinner and label
 *
 * Default label: "Loading live session..." — customizable via label prop
 * Aa component StreamVideoProvider, LiveMeetingClient, ane MeetingRoom ma use thay chhe
 * This component is used in StreamVideoProvider, LiveMeetingClient, and MeetingRoom
 */
"use client";

import { Loader2 } from "lucide-react";

export default function LiveLoader({ label = "Loading live session..." }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
