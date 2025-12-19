import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  // Filter out enrolled courses from available courses
  const availableCourses = courses.filter(
    course => !enrolledCourses.some(
      ({ Course: enrolled }) => enrolled.id === course.id
    )
  );

  return (
    <div className="container mx-auto p-6 space-y-10">
      
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Enrolled Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you have access to
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses purchased"
            description="You haven't purchased any courses yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((enrollment) => (
              <CourseProgressCard key={enrollment.Course.id} data={enrollment} /> 
            ))}

          </div>
        )}
      </section>

      {/* Available Courses Section */}
      <section>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Available Courses</h2>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>

        {availableCourses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses."
            buttonText="Browse All Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}