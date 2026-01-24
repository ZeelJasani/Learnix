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
