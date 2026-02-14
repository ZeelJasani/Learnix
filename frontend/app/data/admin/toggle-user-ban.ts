// Aa file admin mate user no ban status toggle karva ni server action chhe
// This file provides a server action to toggle user ban status
"use server";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function toggleUserBan(userId: string) {
    const token = await getAuthToken();

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    const response = await api.put(`/admin/users/${userId}/ban`, {}, token);

    if (response.success) {
        revalidatePath("/admin/users");
        return { success: true };
    }

    return { success: false, message: response.message || "Failed to update ban status" };
}
