import "server-only";

import { api, getAuthToken } from "@/lib/api-client";

export interface UserType {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
    createdAt: string;
}

export async function getAllUsers(): Promise<UserType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<{ users: UserType[] }>('/admin/users', token);

    if (response.success && response.data) {
        return response.data.users || response.data as unknown as UserType[];
    }

    return [];
}
