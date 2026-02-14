"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban, CheckCircle } from "lucide-react";
import { toggleUserBan } from "@/app/data/admin/toggle-user-ban";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserActionsProps {
    userId: string;
    isBanned: boolean;
}

export function UserActions({ userId, isBanned }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggleBan = async () => {
        setIsLoading(true);
        try {
            const result = await toggleUserBan(userId);
            if (result.success) {
                toast.success(isBanned ? "User unbanned successfully" : "User banned successfully");
                router.refresh(); // Refresh to update UI state
            } else {
                toast.error(result.message || "Action failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={handleToggleBan}
                    disabled={isLoading}
                    className={isBanned ? "text-green-600" : "text-red-600"}
                >
                    {isBanned ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unban User
                        </>
                    ) : (
                        <>
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
