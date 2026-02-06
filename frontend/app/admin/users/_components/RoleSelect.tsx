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
                toast.error("Failed to update role");
            }
        } catch (error) {
            setRole(role);
            toast.error("An error occurred");
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
