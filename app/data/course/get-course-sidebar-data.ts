// app/data/course/get-course-sidebar-data.ts
import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  try {
    const session = await requireUser();

    const course = await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        fileKey: true,
        description: true,
        level: true,
        duration: true,
        category: true,
        slug: true,
        chapter: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                title: true,
                position: true,
                description: true,
                lessonProgress: {
                  where: { userId: session.id },
                  select: {
                    completed: true,
                    lessonId: true,
                    id: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      notFound();
    }

    return { course };
  } catch (error) {
    console.error('Error in getCourseSidebarData:', error);
    throw error;
  }
}