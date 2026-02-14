/**
 * Live Session Layout — Stream.io Video SDK CSS ane Provider wrap kare chhe
 * Live Session Layout — Wraps Stream.io Video SDK CSS and Provider
 *
 * Aa layout /live/* routes mate StreamVideoProvider provide kare chhe
 * This layout provides StreamVideoProvider for /live/* routes
 *
 * Imports:
 * - @stream-io/video-react-sdk/dist/css/styles.css — Stream SDK default styles
 * - stream-overrides.css — Custom theme overrides for dark/light mode
 * - StreamVideoProvider — Authentication + client initialization
 */
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./stream-overrides.css";
import StreamVideoProvider from "@/components/live/StreamVideoProvider";

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
