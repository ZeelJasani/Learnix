/**
 * LiveCallAlert — Live session error/status alert card with "Back to Dashboard" action
 * LiveCallAlert — Live session error/status alert card with "Back to Dashboard" action
 *
 * Use cases:
 * - Session not started yet — "Your live session has not started yet" (MeetingSetup)
 * - Session ended — "This live session has ended" (MeetingSetup)
 * - Join failed — "Unable to join live session" (LiveSessionPage)
 * - Customizable — title, description, actionHref, actionLabel props
 */
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LiveCallAlertProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function LiveCallAlert({
  title,
  description,
  actionHref = "/dashboard",
  actionLabel = "Back to Dashboard",
}: LiveCallAlertProps) {
  return (
    <section className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-xl border bg-card">
        <CardContent className="flex flex-col gap-4 p-6 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button asChild className="mx-auto w-fit">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
