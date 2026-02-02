import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { FileQuestion, ChevronLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  if (!course?.course?.chapter?.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">No chapters available</h2>
        <p className="mt-2 text-muted-foreground mb-8 text-center max-w-sm">
          This course does not have any chapters yet. Please check back later or contact your mentor.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const firstChapter = course.course.chapter[0];

  if (!firstChapter.lessons?.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">No lessons available</h2>
        <p className="mt-2 text-muted-foreground mb-8 text-center max-w-sm">
          This chapter currently has no lessons. Please check back later.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight">No content available</h2>
      <p className="mt-2 text-muted-foreground mb-8 text-center max-w-sm">
        This course seems to be empty. Please check back later.
      </p>
      <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}