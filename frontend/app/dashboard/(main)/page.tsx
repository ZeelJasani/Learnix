/**
 * Dashboard Home Page — Student na enrolled courses nu grid display
 * Dashboard Home Page — Grid display of student's enrolled courses
 *
 * Aa server component chhe je student na enrolled courses fetch kari ne CourseProgressCard grid ma display kare chhe
 * This server component fetches student's enrolled courses and displays them in CourseProgressCard grid
 *
 * Features:
 * - getEnrolledCourses() — Server-side enrolled courses data fetch
 * - Responsive grid — 1/2/3 columns (mobile/md/xl breakpoints)
 * - EmptyState — "No courses purchased" fallback with "Browse Courses" link
 * - CourseProgressCard — Progress bar sathe course cards
 *   CourseProgressCard — Course cards with progress bar
 */
import { getEnrolledCourses } from "../../data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { CourseProgressCard } from "../_components/CourseProgressCard";

export default async function DashboardPage() {
  const enrolledCourses = await getEnrolledCourses();

  return (
    <div className="px-6 py-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Enrolled Courses - Responsive Grid */}
        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses purchased"
            description="You haven't purchased any courses yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          enrolledCourses.map((enrollment) => (
            <div key={enrollment.Course.id} className="h-full">
              <CourseProgressCard data={enrollment} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}