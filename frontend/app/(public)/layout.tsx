import { ReactNode } from "react";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}