"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, FileQuestion, Plus, ArrowLeft, BookOpen } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { CreateActivityDialog } from "@/app/admin/activities/_components/create-activity-dialog"
import { SelectCourseCard } from "../_components/SelectCourseCard"

interface Quiz {
    id: string
    title: string
    description: string
    courseId: string
    courseTitle: string
    timeLimit: number
    passingScore: number
    maxAttempts: number
    isPublished: boolean
    questionsCount: number
    createdAt: string
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

export default function MentorQuizzesPage() {
    const { getToken } = useAuth()
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken()
                const [quizzesRes, coursesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/quizzes`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/courses`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])
                const jsonQuizzes = await quizzesRes.json()
                const jsonCourses = await coursesRes.json()

                setQuizzes(Array.isArray(jsonQuizzes.data) ? jsonQuizzes.data : [])
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
    const courseGroups = quizzes.reduce<Record<string, { courseTitle: string; quizzes: Quiz[] }>>((acc, quiz) => {
        if (!acc[quiz.courseId]) {
            acc[quiz.courseId] = { courseTitle: quiz.courseTitle, quizzes: [] }
        }
        acc[quiz.courseId].quizzes.push(quiz)
        return acc
    }, {})

    if (selectedCourseId) {
        const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId)
        const courseQuizzes = quizzes.filter(q => q.courseId === selectedCourseId)

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
                                <FileQuestion className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Quizzes for {selectedCourse?.title}</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Manage quizzes for this specific course
                            </p>
                        </div>
                        <Button onClick={() => setDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Quiz
                        </Button>
                    </div>

                    <CreateActivityDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        availableCourses={courses}
                        preSelectedCourseId={selectedCourseId}
                        onCreated={() => window.location.reload()}
                        defaultType="quiz"
                    />

                    <Separator />

                    {courseQuizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <FileQuestion className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">No quizzes found</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                This course doesn&apos;t have any quizzes yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {courseQuizzes.map((quiz) => (
                                <Card key={quiz.id} className="hover:border-primary/30 transition-colors">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base">{quiz.title}</CardTitle>
                                            <Badge
                                                variant="outline"
                                                className={quiz.isPublished
                                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                    : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                                                }
                                            >
                                                {quiz.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                        </div>
                                        {quiz.description && (
                                            <CardDescription className="line-clamp-2 text-xs mt-1">
                                                {quiz.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground">{quiz.questionsCount}</span> questions
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground">{quiz.timeLimit}</span> min limit
                                            </div>
                                            <div className="flex items-center gap-1">
                                                Pass: <span className="font-medium text-foreground">{quiz.passingScore}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                Max: <span className="font-medium text-foreground">{quiz.maxAttempts}</span> attempts
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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
                        Choose a course to manage its quizzes
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
                        You need to create a course first before adding quizzes.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const courseId = course._id || course.id;
                        const courseQuizzesCount = quizzes.filter(q => q.courseId === courseId).length;

                        return (
                            <SelectCourseCard
                                key={courseId}
                                data={course as any}
                                onClick={() => setSelectedCourseId(courseId as string)}
                                badgeText={`${courseQuizzesCount} ${courseQuizzesCount === 1 ? 'Quiz' : 'Quizzes'}`}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
