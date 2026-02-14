/**
 * MeetingSetup — Live session join karva pahela device setup ane time validation
 * MeetingSetup — Device setup and time validation before joining live session
 *
 * Features:
 * - VideoPreview — Camera preview with DeviceSettings
 * - Mic/Camera toggle — isMicCamToggled state thi enable/disable
 *   Mic/Camera toggle — Enable/disable via isMicCamToggled state
 * - Time validation — callStartsAt check (session time na aayi to alert)
 *   Time validation — callStartsAt check (shows alert if session time hasn't arrived)
 * - Session ended check — callEndedAt hoy to LiveCallAlert display
 *   Session ended check — Displays LiveCallAlert if callEndedAt is set
 * - "Join session" — call.join() + setIsSetupComplete(true)
 */
"use client";

import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";
import LiveCallAlert from "./LiveCallAlert";

import { toast } from "sonner";

export default function MeetingSetup({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();

  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();
  if (!call) {
    throw new Error("useStreamCall must be used within a StreamCall component.");
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived) {
    return (
      <LiveCallAlert
        title="Your live session has not started yet."
        description={`Starts at ${callStartsAt.toLocaleString()}`}
      />
    );
  }

  if (callHasEnded) {
    return <LiveCallAlert title="This live session has ended." />;
  }

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-center text-2xl font-semibold">Setup</h1>
      <div className="w-full max-w-3xl">
        <VideoPreview />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        onClick={async () => {
          try {
            await call.join();
            setIsSetupComplete(true);
          } catch (error: any) {
            console.error("Failed to join meeting:", error);
            const msg = error.message || "Unknown error";
            if (msg.includes("Permission denied") || msg.includes("user media")) {
              toast.error("Permission denied", {
                description: "Please allow camera/microphone access in your browser settings.",
              });
            } else {
              toast.error("Failed to join session", {
                description: msg,
              });
            }
          }
        }}
      >
        Join session
      </Button>
    </div>
  );
}
