import { getEnrolledCourses } from "../../data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { CourseProgressCard } from "../_components/CourseProgressCard";

export default async function DashboardPage() {
  const enrolledCourses = await getEnrolledCourses();

  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">My Courses</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {enrolledCourses.length > 0
            ? `${enrolledCourses.length} enrolled courses`
            : "Start learning today"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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