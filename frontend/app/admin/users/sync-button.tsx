/**
 * SyncUsersButton Component — Clerk thi database ma users sync karva mate button
 * SyncUsersButton Component — Button to sync users from Clerk to database
 *
 * Aa client component chhe je admin ne manually Clerk users database ma sync karva de chhe
 * This is a client component that allows admin to manually sync Clerk users to database
 *
 * Features:
 * - syncUsersFromClerk() server action call — Last 100 Clerk users sync kare chhe
 *   syncUsersFromClerk() server action call — Syncs last 100 Clerk users
 * - useTransition — Non-blocking async operation with loading state
 * - Loading spinner — RefreshCw icon animate-spin while syncing
 * - Toast feedback — Success (count) / error messages via sonner
 */
"use client";

import { useTransition } from "react";
import { syncUsersFromClerk } from "./actions";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function SyncUsersButton() {
    const [isPending, startTransition] = useTransition();

    const handleSync = () => {
        startTransition(async () => {
            const result = await syncUsersFromClerk();
            if (result.success) {
                toast.success(`Synced ${result.count} users from Clerk`);
            } else {
                toast.error("Failed to sync users");
            }
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isPending}
            className="gap-2"
        >
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Syncing..." : "Sync Users"}
        </Button>
    );
}
