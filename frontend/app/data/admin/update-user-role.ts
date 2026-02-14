// Aa file admin mate user no role (admin/mentor/user) update karva ni server action chhe
// This file provides a server action to update a user's role with path revalidation
"use server";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
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

    console.error("Update Role Failed:", response);
    return { success: false, message: response.message || "Failed to update role" };
}
