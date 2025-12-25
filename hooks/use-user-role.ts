"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface UserRole {
    role: string | null;
    isAdmin: boolean;
    isLoading: boolean;
}

export function useUserRole(): UserRole {
    const { isSignedIn, isLoaded } = useUser();
    const [role, setRole] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            setRole(null);
            setIsAdmin(false);
            setIsLoading(false);
            return;
        }

        const fetchRole = async () => {
            try {
                const response = await fetch("/api/user/get-current-user-role");
                const data = await response.json();
                setRole(data.role);
                setIsAdmin(data.isAdmin);
            } catch (error) {
                console.error("Error fetching user role:", error);
                setRole(null);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRole();
    }, [isSignedIn, isLoaded]);

    return { role, isAdmin, isLoading };
}
