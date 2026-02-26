"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ListTodo, FileText, FileQuestion, Video, BookOpen, Layout, Plus, ArrowLeft } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { CreateActivityDialog } from "@/app/admin/activities/_components/create-activity-dialog"
import { SelectCourseCard } from "../_components/SelectCourseCard"

interface Activity {
    id: string
    title: string
    description?: string
    type: string
    courseId: string
    courseTitle: string
    dueDate?: string
    startDate?: string
    createdAt: string
}

const typeIcons: Record<string, any> = {
    assignment: FileText,
    quiz: FileQuestion,
    video: Video,
    reading: BookOpen,
    project: Layout,
}

const typeColors: Record<string, string> = {
    assignment: "text-blue-400",
    quiz: "text-amber-400",
    video: "text-purple-400",
    reading: "text-emerald-400",
    project: "text-rose-400",
}

interface Course {
    _id?: string
    id?: string
    title: string
    smallDescription?: string
    duration?: number | string
    level?: string
    status?: string
}

export default function MentorActivitiesPage() {
    const { getToken } = useAuth()
    const [activities, setActivities] = useState<Activity[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken()
                const [activitiesRes, coursesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/activities`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/courses`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])
                const jsonActivities = await activitiesRes.json()
                const jsonCourses = await coursesRes.json()

                setActivities(Array.isArray(jsonActivities.data) ? jsonActivities.data : [])
                setCourses(Array.isArray(jsonCourses.data) ? jsonCourses.data : (Array.isArray(jsonCourses) ? jsonCourses : []))
            } catch {
                toast.error("Failed to load data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [getToken])

    // Group by course
    const courseGroups = activities.reduce<Record<string, { courseTitle: string; activities: Activity[] }>>((acc, act) => {
        if (!acc[act.courseId]) {
            acc[act.courseId] = { courseTitle: act.courseTitle, activities: [] }
        }
        acc[act.courseId].activities.push(act)
        return acc
    }, {})

    if (selectedCourseId) {
        const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId)
        const courseActivities = activities.filter(a => a.courseId === selectedCourseId)

        return (
            <div className="flex flex-1 flex-col gap-6 p-6 md:p-10">
                <div className="flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        className="w-fit -ml-4 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedCourseId(null)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Button>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ListTodo className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Activities for {selectedCourse?.title}</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Manage activities for this specific course
                            </p>
                        </div>
                        <Button onClick={() => setDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Activity
                        </Button>
                    </div>

                    <CreateActivityDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        availableCourses={courses}
                        preSelectedCourseId={selectedCourseId}
                        onCreated={() => window.location.reload()}
                        defaultType="assignment"
                    />

                    <Separator />

                    {courseActivities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <ListTodo className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">No activities found</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                This course doesn&apos;t have any activities yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {courseActivities.map((act) => {
                                const IconComp = typeIcons[act.type] || ListTodo
                                const colorClass = typeColors[act.type] || "text-muted-foreground"

                                return (
                                    <Card key={act.id} className="hover:border-primary/30 transition-colors">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 ${colorClass}`}>
                                                    <IconComp className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base">{act.title}</CardTitle>
                                                    {act.description && (
                                                        <CardDescription className="line-clamp-2 text-xs mt-1">
                                                            {act.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                                <Badge variant="outline" className="capitalize text-xs shrink-0">
                                                    {act.type}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                {act.startDate && (
                                                    <span>
                                                        Start: {new Date(act.startDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {act.dueDate && (
                                                    <span>
                                                        Due: {new Date(act.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {!act.startDate && !act.dueDate && (
                                                    <span>
                                                        Created: {new Date(act.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Select a Course</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Choose a course to manage its activities
                    </p>
                </div>
            </div>

            <Separator />

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No courses found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                        You need to create a course first before adding activities.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const courseId = course._id || course.id;
                        const courseActivitiesCount = activities.filter(a => a.courseId === courseId).length;

                        return (
                            <SelectCourseCard
                                key={courseId}
                                data={course as any}
                                onClick={() => setSelectedCourseId(courseId as string)}
                                badgeText={`${courseActivitiesCount} ${courseActivitiesCount === 1 ? 'Activity' : 'Activities'}`}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
