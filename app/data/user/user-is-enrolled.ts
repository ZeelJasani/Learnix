

import "server-only";


import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";


export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const user = await requireUser();
  if (!user) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        courseId: courseId,
        userId: user.id,
      },
    },
    select: {
        status: true,
    }
  });


  return enrollment?.status === "Active" ? true : false;
}