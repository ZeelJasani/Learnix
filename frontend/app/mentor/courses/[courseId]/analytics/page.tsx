import { Metadata } from "next";
import { DropOffAnalytics } from "@/components/dashboard/drop-off-analytics";
import { ChevronLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Course Analytics | Learnix Mentor",
  description: "Track student progress and identify curriculum drop-off points.",
};

export default async function CourseAnalyticsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <Link
          href="/mentor/courses"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "w-fit -ml-2" })}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to My Courses
        </Link>
        
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Advanced Analytics
                </h1>
                <p className="text-muted-foreground">
                    Actionable insights into your students' learning journey
                </p>
            </div>
        </div>
      </div>

      <DropOffAnalytics courseId={courseId} />
    </div>
  );
}
