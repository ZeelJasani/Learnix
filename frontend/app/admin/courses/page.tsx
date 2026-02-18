import { requireAdmin } from "@/app/data/admin/require-admin";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { BookOpen, Plus } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Courses</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/courses/create">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Course
          </Link>
        </Button>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No course found"
        description="Create your first course to get started"
        buttonText="Create Course"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}