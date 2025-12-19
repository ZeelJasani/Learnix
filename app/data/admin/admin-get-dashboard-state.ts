import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

interface DailyStat {
  date: string;
  signups: bigint;
  enrollments: bigint;
}

type DashboardStats = {
  totalSignups: number;
  totalCustomers: number;
  totalCourses: number;
  totalLessons: number;
  recentSignups: number;
  activeUsers: number;
  statsByDate: Array<{
    date: string;
    signups: number;
    enrollments: number;
  }>;
};

export async function adminGetDashboardStats(): Promise<DashboardStats> {
  try {
    await requireAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // First, fetch all the counts in parallel
    const [
      totalSignups,
      totalCustomers,
      totalCourses,
      totalLessons,
      recentSignups,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { enrollment: { some: {} } },
      }),
      prisma.course.count({
        where: { status: 'PUBLISHED' },
      }),
      prisma.lesson.count({
        where: { 
          Chapter: {
            Course: {
              status: 'PUBLISHED'
            }
          }
        },
      }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.user.count({
        where: { 
          sessions: {
            some: {
              updatedAt: { gte: sevenDaysAgo }
            }
          }
        },
      }),
    ]);

    // Then fetch the daily stats with proper typing (PostgreSQL)
    const dailyStats = await prisma.$queryRaw<DailyStat[]>`
      SELECT
        date_trunc('day', u."createdAt")::date AS date,
        COUNT(DISTINCT CASE WHEN COALESCE(u.role, 'user') = 'user' THEN u.id END) AS signups,
        COUNT(DISTINCT e.id) AS enrollments
      FROM "user" u
      LEFT JOIN "Enrollment" e ON u.id = e."userId"
      WHERE u."createdAt" >= ${thirtyDaysAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // Convert BigInt to Number for JSON serialization
    const formattedStats = dailyStats.map(stat => ({
      date: stat.date,
      signups: Number(stat.signups),
      enrollments: Number(stat.enrollments)
    }));

    return {
      totalSignups,
      totalCustomers,
      totalCourses,
      totalLessons,
      recentSignups,
      activeUsers,
      statsByDate: formattedStats,
    };
  } catch (error) {
    console.error('Error in adminGetDashboardStats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}