import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";


type Params = Promise<{ courseId: string }>

export default async function EditRoute({ params }: { params: Params }) {

    const { courseId } = await params;
    const data = await adminGetCourse(courseId);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Course: <span className="text-primary">{data.title}</span></h1>



            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Baic Information</TabsTrigger>
                    <TabsTrigger value="course-structure">course structure</TabsTrigger>
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
                            <CardTitle>course structure</CardTitle>
                            <CardDescription>
                                Here you can update your course structure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}