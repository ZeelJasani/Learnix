// ============================================================================
// Learnix LMS - User Role Hook (યુઝર રોલ હુક)
// ============================================================================
// Aa hook current user no role detect kare chhe (Admin/Mentor/User).
// This hook detects the current user's role (Admin/Mentor/User).
//
// Two-phase approach / બે-તબક્કાનો અભિગમ:
// 1. INSTANT: Clerk publicMetadata mathi role read karo (zero latency)
// 2. BACKGROUND: Backend API ne sync karo (non-blocking)
//
// Aa ensure kare chhe ke user ne instant role access male ane DB pani
// sync rahe chhe silently.
// This ensures the user gets instant role access while DB is also
// synced silently.
// ============================================================================

"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

// User role result type / User role result type
export interface UserRole {
    role: string | null;
    isAdmin: boolean;
    isMentor: boolean;
    isLoading: boolean;
}

// Backend API URL / Backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Current user no role return karo / Return current user's role
 *
 * Clerk metadata mathi instant role ane background DB sync sathe.
 * With instant role from Clerk metadata and background DB sync.
 */
export function useUserRole(): UserRole {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Duplicate sync calls prevent karo / Prevent duplicate sync calls
    const syncStarted = useRef(false);

    useEffect(() => {
        if (!isLoaded) return;

        // User nathi to role null set karo / Set role null if no user
        if (!user) {
            setRole(null);
            setIsLoading(false);
            return;
        }

        // ✅ INSTANT: Clerk publicMetadata mathi role read karo (zero latency)
        // ✅ INSTANT: Read role from Clerk publicMetadata first (zero latency)
        const metadataRole = (user.publicMetadata as { role?: string })?.role;
        if (metadataRole) {
            setRole(metadataRole);
            setIsLoading(false);
        }

        // 🔄 BACKGROUND: DB sathe silent sync karo (non-blocking)
        // 🔄 BACKGROUND: Sync to DB silently (non-blocking)
        if (!syncStarted.current) {
            syncStarted.current = true;

            // Fire and forget - await nahi / Fire and forget - no await
            (async () => {
                try {
                    const token = await getToken();
                    if (!token) return;

                    // Backend API ne user data sync karo
                    // Sync user data to backend API
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

                        // DB role alag hoy to local state update karo
                        // Update local state if DB role differs
                        if (dbRole && dbRole !== metadataRole) {
                            setRole(dbRole);
                        }

                        // Clerk metadata update karo (next instant load mate)
                        // Update Clerk metadata (for next instant load)
                        if (dbRole && dbRole !== metadataRole) {
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

        // Metadata role na hoy to loading band karo
        // Stop loading if no metadata role
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
