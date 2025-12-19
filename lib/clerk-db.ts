import "server-only";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import type { User } from "@/lib/generated/prisma";

export type ClerkUserLike = {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
};

export async function getOrCreateDbUserFromClerkUser(clerkUser: ClerkUserLike): Promise<User> {
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  const adminEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const shouldBeAdmin = adminEmails.includes(email.toLowerCase());

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0];

  const existing = await prisma.user.findUnique({ where: { id: clerkUser.id } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name,
        email,
        image: clerkUser.imageUrl,
        emailVerified: true,
        role: shouldBeAdmin ? "admin" : existing.role,
        updatedAt: new Date(),
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        name,
        image: clerkUser.imageUrl,
        emailVerified: true,
        role: shouldBeAdmin ? "admin" : existingByEmail.role,
        updatedAt: new Date(),
      },
    });
  }

  return prisma.user.create({
    data: {
      id: clerkUser.id,
      name,
      email,
      emailVerified: true,
      image: clerkUser.imageUrl,
      role: shouldBeAdmin ? "admin" : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
