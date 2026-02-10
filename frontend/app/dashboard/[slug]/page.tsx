import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseDashboardClient } from "./_components/CourseDashboardClient";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  if (!course?.course) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Course not found</h2>
        <p className="mt-2 text-muted-foreground">
          The course you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  return <CourseDashboardClient course={course.course} slug={slug} />;
}