import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-state"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { EmptyState } from "@/components/general/EmptyState"
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses"
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard"
import { Suspense } from "react"
import { headers } from "next/headers"
import { requireAdmin } from "@/app/data/admin/require-admin";


export const dynamic = 'force-dynamic'

export default async function AdminPage() {

    await requireAdmin();
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?callbackUrl=/admin')
  }
  
  // Check if user is admin
  const userRole = (session.user.role || '').toString().toLowerCase()
  if (userRole !== 'admin') {
    redirect('/not-admin')
  }

  const enrollmentData = await adminGetEnrollmentStats()
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  )
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses()

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="You don't have any courses. Create some to see them here."
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  )
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}

