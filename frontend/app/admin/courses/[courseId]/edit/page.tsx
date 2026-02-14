/**
 * Edit Course Page — Course editing mate tabbed interface with 3 sections
 * Edit Course Page — Tabbed interface for course editing with 3 sections
 *
 * Aa server component chhe je admin/mentor ne course edit karva mate 3-tab layout provide kare chhe
 * This is a server component that provides a 3-tab layout for admin/mentor to edit courses
 *
 * Tabs:
 * 1. Basic Info — EditCourseForm (title, slug, description, thumbnail, category, level, etc.)
 * 2. Structure — CourseStructure (chapters + lessons CRUD ane reordering)
 *    Structure — CourseStructure (chapters + lessons CRUD and reordering)
 * 3. Activities — CourseActivities (activities, assignments, quizzes management)
 *
 * Features:
 * - requireAdminOrMentor() — Server-side role guard
 * - adminGetCourse(courseId) — Full course data fetch including chapters, lessons
 * - Dynamic route — params.courseId thi course identify kare chhe
 *   Dynamic route — Identifies course from params.courseId
 */
import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { requireAdminOrMentor } from "@/app/data/admin/require-admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";
import { CourseActivities } from "./_components/CourseActivities";


type Params = Promise<{ courseId: string }>

export default async function EditRoute({ params }: { params: Params }) {
    await requireAdminOrMentor();

    const { courseId } = await params;
    const data = await adminGetCourse(courseId);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-12 mt-6">Edit Course: <span className="text-primary">{data.title}</span></h1>



            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Structure</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>
                                Provide basic information about the course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your course structure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="activities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activities</CardTitle>
                            <CardDescription>
                                Manage activities, assignments and quizzes for this course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseActivities data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}