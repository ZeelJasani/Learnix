/**
 * Course Layout — Course-specific sidebar + header + content area layout
 * Course Layout — Course-specific layout with sidebar + header + content area
 *
 * Aa server component chhe je individual course pages ne CourseSidebar ane breadcrumb header sathe render kare chhe
 * This server component renders individual course pages with CourseSidebar and breadcrumb header
 *
 * Features:
 * - getCourseSidebarData(slug) — Course data (chapters, lessons, progress) fetch kare chhe
 *   getCourseSidebarData(slug) — Fetches course data (chapters, lessons, progress)
 * - CourseSidebar — Chapter/lesson navigation tree with progress indicators
 * - SidebarInset + header — SidebarTrigger + Breadcrumb navigation bar
 * - "Course not found" fallback — jya data na hoy tyare display thay chhe
 *   "Course not found" fallback — Displayed when course data is unavailable
 */
import { ReactNode } from "react";
import { CourseSidebar } from "@/components/course-sidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;
  const data = await getCourseSidebarData(slug);

  if (!data?.course) {
    return <div>Course not found</div>;
  }

  return (
    <SidebarProvider>
      <CourseSidebar course={data.course} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}