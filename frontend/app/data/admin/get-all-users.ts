// Aa file admin mate badha registered users ni list fetch kare chhe
// This file fetches all registered users for the admin user management page
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

export interface UserType {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
    banned: boolean;
    createdAt: string;
}

export async function getAllUsers(search?: string): Promise<UserType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);

    const response = await api.get<{ users: UserType[] }>(`/admin/users?${queryParams.toString()}`, token);

    if (response.success && response.data) {
        console.log("Admin Users Data (Debug):", JSON.stringify(response.data, null, 2)); // Debug log
        const users = response.data.users || response.data as unknown as any[];
        // Map _id to id to ensure frontend compatibility
        return users.map((user: any) => ({
            ...user,
            id: user.id || user._id,
        })) as UserType[];
    }

    return [];
}
