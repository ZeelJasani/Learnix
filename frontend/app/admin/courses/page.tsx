/**
 * Admin Courses Page — Admin mate badha courses ni listing page
 * Admin Courses Page — All courses listing page for admin
 *
 * Aa server component chhe je admin na badha courses grid layout ma display kare chhe
 * This is a server component that displays all admin courses in grid layout
 *
 * Features:
 * - requireAdmin() — Admin access guard
 * - force-dynamic — Fresh data on every request
 * - "Create Course" button — /admin/courses/create page par navigate
 *   "Create Course" button — Navigates to /admin/courses/create page
 * - Suspense + skeleton loading — AdminCourseCardSkeletonLayout
 * - RenderCourses — Async component je adminGetCourses() thi data fetch kare chhe
 *   RenderCourses — Async component that fetches data via adminGetCourses()
 * - EmptyState — "No course found" with CTA to create course
 * - Responsive grid — 1 col (mobile), 2 cols (md), 3 cols (xl)
 */
// {@ts-expect-error Server Component }

import { requireAdmin } from "@/app/data/admin/require-admin";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  await requireAdmin();

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Course
        </Link>
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
        description="create a new course"
        buttonText="create course"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}