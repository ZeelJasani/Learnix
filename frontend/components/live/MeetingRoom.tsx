/**
 * MeetingRoom — Active live session nu video meeting room with layout switching
 * MeetingRoom — Active live session video meeting room with layout switching
 *
 * Features:
 * - 3 layouts — Grid, Speaker-Left, Speaker-Right (DropdownMenu thi switch)
 * - CallControls — Stream SDK na built-in call controls (mute, video, etc.)
 * - CallParticipantsList — Togglable participants sidebar
 * - CallStatsButton — Real-time call statistics
 * - EndCallButton — Session owner mate "End session" button (Stream + API call)
 * - CallingState check — JOINED state aayu tyare j room render thay chhe
 *   CallingState check — Room renders only when JOINED state is reached
 */
"use client";

import { useState } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutList, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import LiveLoader from "./LiveLoader";
import EndCallButton from "./EndCallButton";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export default function MeetingRoom({ sessionId }: { sessionId: string }) {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <LiveLoader label="Joining live session..." />;
  }

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1100px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("hidden h-[calc(100vh-86px)] ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-3 pb-4">
        <CallControls onLeave={() => router.push(`/dashboard`)} />

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-2xl border bg-background px-4 py-2 text-foreground shadow-sm">
            <LayoutList size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border bg-background text-foreground">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={item}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                {index < 2 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="rounded-2xl border bg-background px-4 py-2 text-foreground shadow-sm"
        >
          <Users size={18} />
        </button>
        {!isPersonalRoom && <EndCallButton sessionId={sessionId} />}
      </div>
    </section>
  );
}
