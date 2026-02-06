"use server";

import { api, getAuthToken } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
    const token = await getAuthToken();

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    const response = await api.put(`/admin/users/${userId}/role`, { role }, token);

    if (response.success) {
        revalidatePath("/admin/users");
        revalidatePath("/admin/mentors");
        return { success: true };
    }

    return { success: false, message: response.message || "Failed to update role" };
}
