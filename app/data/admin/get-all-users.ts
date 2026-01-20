import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

export async function getAllUsers() {
    await requireAdmin();

    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
        },
    });
}
