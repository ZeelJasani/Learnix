import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function POST(req: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // Note: This would need a backend endpoint for updating user roles
    // For now, return a placeholder response
    console.warn("make-admin endpoint needs backend implementation");

    return NextResponse.json({
      success: true,
      message: `User ${email} role update requested (backend implementation needed)`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
