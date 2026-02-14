/**
 * EndCallButton — Session owner mate "End session" button with dual cleanup
 * EndCallButton — "End session" button for session owner with dual cleanup
 *
 * Features:
 * - Owner check — localParticipant.userId === call.state.createdBy.id
 *   Faqat session creator ne j "End session" button dikhay chhe
 *   Only shows "End session" button to the session creator
 * - Dual end — call.endCall() (Stream SDK) + /live-sessions/:id/end (Backend API)
 * - Error handling — toast.error for failures, always redirects to /dashboard
 * - Red styling — bg-red-500 for clear "destructive" action indicator
 */
"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EndCallButton({ sessionId }: { sessionId: string }) {
  const call = useCall();
  const router = useRouter();
  const { getToken } = useAuth();

  if (!call) {
    throw new Error("useStreamCall must be used within a StreamCall component.");
  }

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    try {
      await call.endCall();
    } catch (error) {
      console.error("Failed to end call in Stream:", error);
    }

    try {
      if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is missing");
      const token = await getToken();
      if (!token) throw new Error("Unable to get auth token");

      const response = await fetch(`${API_URL}/live-sessions/${sessionId}/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to end session");
      }
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message || "Failed to end session");
    } finally {
      router.push("/dashboard");
    }
  };

  return (
    <Button onClick={endCall} className="bg-red-500 text-white hover:bg-red-600">
      End session
    </Button>
  );
}
