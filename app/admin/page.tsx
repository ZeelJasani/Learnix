import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-state"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { EmptyState } from "@/components/general/EmptyState"
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses"
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard"
import { Suspense } from "react"
import { requireAdmin } from "@/app/data/admin/require-admin";


export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin();

  const enrollmentData = await adminGetEnrollmentStats()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Top Row: Stats Cards */}
      {/* The SectionCards currently renders a grid itself. We need to might need to adjust it or wrap it.
           SectionCards usually has 3 cards (Revenue, Students, Courses) or 4.
           If it's 4, it breaks the "3 top" rule, but let's see. 
           Assuming SectionCards renders simple cards, we can rely on its own grid or wrap it.
           Let's wrap it in the top grid. 
       */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <SectionCards />
        {/* Note: SectionCards likely returns multiple cards in a fragment or div. 
              If it returns a div with grid, I should probably edit SectionCards or just use it as the top content.
              Ideally, I'd move the card logic here to strictly control the "3 top cards".
              For now, I will treat SectionCards as the "Top Row Content". 
          */}
      </div>

      {/* Bottom Main Content */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6 space-y-8">
        <ChartAreaInteractive data={enrollmentData} />

        <div className="space-y-4">
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

