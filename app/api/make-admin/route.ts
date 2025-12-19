import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function POST(req: Request) {
  try {
    await requireAdmin(true);

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email : null;
    const role = typeof body?.role === "string" ? body.role : null;

    if (!email || !role) {
      return NextResponse.json(
        { success: false, error: "email and role are required" },
        { status: 400 }
      );
    }

    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== "admin" && normalizedRole !== "user") {
      return NextResponse.json(
        { success: false, error: "role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: normalizedRole },
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} role updated to ${normalizedRole}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
