import { requireAdminOrMentor } from "@/app/data/admin/require-admin";
import CreateCourseClient from "@/app/admin/courses/create/CreateCourseClient2";

export const dynamic = 'force-dynamic';

export default async function MentorCourseCreationPage() {
    // server-side guard
    await requireAdminOrMentor();

    return <CreateCourseClient basePath="/mentor/courses" />;
}
