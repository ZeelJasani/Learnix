import { ReactNode } from "react";
import { CourseSidebar } from "@/components/course-sidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import {
  SidebarInset,
  SidebarProvider,
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
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}