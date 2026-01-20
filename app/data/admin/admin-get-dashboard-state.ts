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

export async function adminGetDashboardStats(
  month?: number,
  year?: number
): Promise<DashboardStats> {
  try {
    await requireAdmin();

    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month !== undefined ? month : now.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0); // Last day of month

    // First, fetch basic counts (Total is absolute, not time-bound)
    const [
      totalSignups,
      totalCustomers,
      totalCourses,
      totalLessons,
      monthlySignups,
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
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
      }),
      prisma.user.count({
        where: {
          sessions: {
            some: {
              updatedAt: { gte: startDate } // Active since start of month
            }
          }
        },
      }),
    ]);

    // Then fetch daily stats for the specific range
    const dailyStats = await prisma.$queryRaw<DailyStat[]>`
      SELECT
        date_trunc('day', u."createdAt")::date AS date,
        COUNT(DISTINCT CASE WHEN COALESCE(u.role, 'user') = 'user' THEN u.id END) AS signups,
        COUNT(DISTINCT e.id) AS enrollments
      FROM "user" u
      LEFT JOIN "Enrollment" e ON u.id = e."userId"
      WHERE u."createdAt" >= ${startDate} AND u."createdAt" <= ${endDate}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // Create a map for quick lookup
    const statsMap = new Map(
      (dailyStats as any[]).map((stat) => [
        new Date(stat.date).toISOString().split('T')[0],
        stat,
      ])
    );

    const formattedStats = [];
    const daysInMonth = endDate.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      // Construct date YYYY-MM-DD in local time logic but matching ISO output
      // We use the same construction logic as the map keys if possible, but simplest is explicit string building
      // to avoid timezone shifts when "noon" or "midnight" is ambiguous.

      const d = new Date(targetYear, targetMonth, day);
      // The map keys are from .toISOString().split('T')[0] which is UTC.
      // We must ensure we generate the matching key. 
      // If we use UTC loop:
      const utcDate = new Date(Date.UTC(targetYear, targetMonth, day));
      const dateString = utcDate.toISOString().split('T')[0];

      // CAUTION: Prisma generic date queries might return 00:00:00 UTC.
      // Let's rely on the formatted date string for the chart label too.

      const stat = statsMap.get(dateString);

      formattedStats.push({
        date: dateString,
        signups: stat ? Number(stat.signups) : 0,
        enrollments: stat ? Number(stat.enrollments) : 0,
      });
    }

    return {
      totalSignups,
      totalCustomers,
      totalCourses,
      totalLessons,
      recentSignups: monthlySignups,
      activeUsers,
      statsByDate: formattedStats,
    };
  } catch (error) {
    console.error('Error in adminGetDashboardStats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}