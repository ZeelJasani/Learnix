/**
 * Delete Course Page — Course delete confirmation mate server-guarded page
 * Delete Course Page — Server-guarded page for course delete confirmation
 *
 * Aa server component chhe je admin ne specific course delete karva mate confirmation UI render kare chhe
 * This is a server component that renders delete confirmation UI for a specific course
 *
 * Features:
 * - requireAdmin() — Admin-only access guard
 * - params.courseId — Dynamic route thi course ID extract kare chhe
 *   params.courseId — Extracts course ID from dynamic route
 * - DeleteCourseClient — Interactive client component for delete confirmation + action
 */
import { requireAdmin } from "@/app/data/admin/require-admin";
import DeleteCourseClient from "./DeleteCourseClient";


export default async function DeleteCourseRoute({ params }: { params: { courseId: string } }) {
  // server-side guard
  await requireAdmin();

  const courseId = params.courseId;

  // render the interactive client component that receives courseId as a prop
  return <DeleteCourseClient courseId={courseId} />;
};