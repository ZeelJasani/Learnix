/**
 * RoleSelect Component — User role change mate inline dropdown select
 * RoleSelect Component — Inline dropdown select for user role change
 *
 * Aa client component chhe je admin/mentors table ma inline role change provide kare chhe
 * This is a client component that provides inline role change in admin/mentors table
 *
 * Features:
 * - Select dropdown — user / mentor / admin options
 * - Color-coded trigger — Role-wise color (red=admin, blue=mentor, slate=user)
 * - updateUserRole() server action — Backend ma role update kare chhe
 *   updateUserRole() server action — Updates role in the backend
 * - Optimistic update — UI ne turant update kare, error par rollback
 *   Optimistic update — Updates UI immediately, rolls back on error
 * - Loading state — Select disabled while request pending
 * - Toast notifications — Success/error messages via sonner
 */
"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/app/data/admin/update-user-role";
import { useState } from "react";
import { toast } from "sonner";

interface RoleSelectProps {
    userId: string;
    currentRole: string;
}

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
    const [role, setRole] = useState(currentRole || "user");
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        setRole(newRole);

        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success("User role updated successfully");
            } else {
                setRole(role);
                console.error("Role update failed:", result.message);
                toast.error(result.message || "Failed to update role");
            }
        } catch (error) {
            setRole(role);
            console.error("Role update error:", error);
            toast.error("An error occurred while updating role");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case "admin":
                return "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/50";
            case "mentor":
                return "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/50";
            case "user":
                return "bg-slate-500/15 text-slate-500 hover:bg-slate-500/25 border-slate-500/50";
            default:
                return "bg-slate-500/15 text-slate-500";
        }
    };

    return (
        <Select
            value={role}
            onValueChange={handleRoleChange}
            disabled={isLoading}
        >
            <SelectTrigger
                className={`w-[110px] h-8 border font-medium capitalize transition-colors ${getRoleColor(role)}`}
            >
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
    );
}
