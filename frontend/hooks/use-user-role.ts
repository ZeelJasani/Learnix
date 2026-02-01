"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

export interface UserRole {
    role: string | null;
    isAdmin: boolean;
    isMentor: boolean;
    isLoading: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useUserRole(): UserRole {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const syncStarted = useRef(false);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            setRole(null);
            setIsLoading(false);
            return;
        }

        // ✅ INSTANT: Read role from Clerk publicMetadata first
        const metadataRole = (user.publicMetadata as { role?: string })?.role;
        if (metadataRole) {
            setRole(metadataRole);
            setIsLoading(false);
        }

        // 🔄 BACKGROUND: Sync to DB silently (non-blocking)
        if (!syncStarted.current) {
            syncStarted.current = true;

            // Fire and forget - no await
            (async () => {
                try {
                    const token = await getToken();
                    if (!token) return;

                    const response = await fetch(`${API_BASE_URL}/users/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            clerkId: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            imageUrl: user.imageUrl,
                        }),
                    });

                    const data = await response.json();

                    if (data.success && data.data?.user) {
                        const dbRole = data.data.user.role;

                        // Update local state if role differs
                        if (dbRole && dbRole !== metadataRole) {
                            setRole(dbRole);
                        }

                        // Update Clerk metadata if different (for next instant load)
                        if (dbRole && dbRole !== metadataRole) {
                            // Call API to update Clerk metadata
                            await fetch('/api/users/update-metadata', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ role: dbRole }),
                            });
                        }
                    }
                } catch (error) {
                    console.error('Background sync error:', error);
                }
            })();
        }

        // If no metadata role, set loading false after initial check
        if (!metadataRole) {
            setIsLoading(false);
        }
    }, [user, isLoaded, getToken]);

    return {
        role,
        isAdmin: role?.toLowerCase() === 'admin',
        isMentor: role?.toLowerCase() === 'mentor',
        isLoading: !isLoaded || isLoading,
    };
}
