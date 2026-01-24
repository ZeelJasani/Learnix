// import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
// import { notFound, redirect } from "next/navigation";

// interface iAppProps {
//   params: { slug: string };
// }

// export default async function CourseSlugRoute({ params }: iAppProps) {
//   const { slug } = params;
  
//   try {
//     const course = await getCourseSidebarData(slug);

//     if (!course?.course) {
//       return notFound();
//     }

//     if (!course.course.chapter?.length) {
//       return (
//         <div className="flex items-center justify-center h-full text-center">
//           <h2 className="text-2xl font-bold mb-2">No chapters available</h2>
//           <p className="text-muted-foreground">
//             This course does not have any chapters yet!
//           </p>
//         </div>
//       );
//     }

//     const firstChapter = course.course.chapter[0];
    
//     if (!firstChapter.lessons?.length) {
//       return (
//         <div className="flex items-center justify-center h-full text-center">
//           <h2 className="text-2xl font-bold mb-2">No lessons available</h2>
//           <p className="text-muted-foreground">
//             This chapter does not have any lessons yet!
//           </p>
//         </div>
//       );
//     }

//     const firstLesson = firstChapter.lessons[0];
    
//     if (firstLesson) {
//       redirect(`/dashboard/${slug}/${firstLesson.id}`);
//     }

//     return notFound();
    
//   } catch (error) {
//     console.error('Error loading course:', error);
//     return notFound();
//   }
// }









import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  const firstChapter = course.course.chapter[0];
  const firstLesson = firstChapter.lessons[0];


  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`)
  }

return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No lessons available</h2>
      <p className="text-muted-foreground">
        This course does not have any lessons yet!
      </p>
    </div>
  );
}