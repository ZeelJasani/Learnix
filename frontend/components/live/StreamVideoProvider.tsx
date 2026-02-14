/**
 * StreamVideoProvider — Stream.io Video SDK client initialize ane authenticate kare chhe
 * StreamVideoProvider — Initializes and authenticates Stream.io Video SDK client
 *
 * Features:
 * - Clerk useAuth() + useUser() thi authenticated user data fetch
 * - Backend /live-sessions/token endpoint thi Stream video token generate
 * - StreamVideoClient create with tokenProvider (auto-refresh)
 * - Loading state — LiveLoader component while client initializes
 * - Cleanup — disconnectUser on unmount
 *
 * Aa provider /live route layout ma wrap thay chhe for all live session pages
 * This provider is wrapped in /live route layout for all live session pages
 */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useAuth, useUser } from "@clerk/nextjs";

import LiveLoader from "./LiveLoader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StreamVideoProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) {
      throw new Error("NEXT_PUBLIC_STREAM_API_KEY is missing");
    }
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is missing");
    }

    const tokenProvider = async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unable to get auth token");
      }

      const response = await fetch(`${API_URL}/live-sessions/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to get Stream token");
      }

      return result.data.token as string;
    };

    const streamClient = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user.id,
        name: user.fullName || user.username || user.id,
        image: user.imageUrl,
      },
      tokenProvider,
    });

    setClient(streamClient);

    return () => {
      streamClient.disconnectUser?.();
    };
  }, [isLoaded, user, getToken]);

  if (!client) {
    return <LiveLoader />;
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}
