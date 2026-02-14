/**
 * Public Layout — Public pages nu wrapper layout
 * Public Layout — Wrapper layout for public pages
 *
 * Aa layout public-facing pages (home, about, courses) ne wrap kare chhe
 * This layout wraps public-facing pages (home, about, courses)
 *
 * Simple container structure — <main> tag ma children render kare chhe
 * Simple container structure — Renders children inside <main> tag
 */
import { ReactNode } from "react";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}