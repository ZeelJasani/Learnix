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