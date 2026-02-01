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