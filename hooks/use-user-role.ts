"use client";

import { useUser } from "@clerk/nextjs";

export interface UserRole {
    role: string | null;
    isAdmin: boolean;
    isLoading: boolean;
}

export function useUserRole(): UserRole {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return { role: null, isAdmin: false, isLoading: true };
    }

    if (!user) {
        return { role: null, isAdmin: false, isLoading: false };
    }

    const role = (user.publicMetadata?.role as string) || null;
    const isAdmin = role === "admin";

    return { role, isAdmin, isLoading: false };
}
