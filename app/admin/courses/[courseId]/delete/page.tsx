import { requireAdmin } from "@/app/data/admin/require-admin";
import DeleteCourseClient from "./DeleteCourseClient";


export default async function DeleteCourseRoute({ params }: { params: { courseId: string } }) {
  // server-side guard
  await requireAdmin();

  const courseId = params.courseId;

  // render the interactive client component that receives courseId as a prop
  return <DeleteCourseClient courseId={courseId} />;
};