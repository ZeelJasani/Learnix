"use client"

import { useEffect, useState, use } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    XCircle,
    FileQuestion,
    ListTodo,
    Loader2,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ChapterProgress {
    chapterId: string
    title: string
    total: number
    completed: number
}

interface QuizResult {
    quizId: string
    title: string
    totalAttempts: number
    bestScore: number
    maxScore: number
    passed: boolean
}

interface ActivityResult {
    activityId: string
    title: string
    type: string
    completed: boolean
}

interface CourseProgress {
    courseId: string
    courseTitle: string
    totalLessons: number
    completedLessons: number
    progressPercentage: number
    chapterProgress: ChapterProgress[]
    quizResults: QuizResult[]
    activityResults: ActivityResult[]
}

interface StudentProgressData {
    student: {
        id: string
        name: string
        email: string
        image: string | null
    }
    courses: CourseProgress[]
}

export default function StudentProgressPage({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = use(params)
    const { getToken } = useAuth()
    const router = useRouter()
    const [data, setData] = useState<StudentProgressData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = await getToken()
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/mentor/students/${studentId}/progress`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const json = await res.json()
                setData(json.data)
            } catch {
                toast.error("Failed to load student progress")
            } finally {
                setLoading(false)
            }
        }
        fetchProgress()
    }, [studentId, getToken])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-6 md:p-10">
                <p className="text-muted-foreground">Student not found or no data available.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/mentor/students")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-12 w-12">
                    <AvatarImage src={data.student.image || ""} />
                    <AvatarFallback>{data.student.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{data.student.name}</h2>
                    <p className="text-muted-foreground text-sm">{data.student.email}</p>
                </div>
            </div>

            <Separator />

            {data.courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No enrolled courses</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                        This student is not enrolled in any of your courses.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {data.courses.map((course) => (
                        <Card key={course.courseId} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                                    <Badge variant="outline" className="text-sm">
                                        {course.progressPercentage}% Complete
                                    </Badge>
                                </div>
                                <Progress value={course.progressPercentage} className="h-2 mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {course.completedLessons} of {course.totalLessons} lessons completed
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Chapter Progress */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Chapter Progress
                                    </h4>
                                    <div className="grid gap-2">
                                        {course.chapterProgress.map((ch) => (
                                            <div key={ch.chapterId} className="flex items-center justify-between rounded-lg border px-4 py-2">
                                                <span className="text-sm">{ch.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {ch.completed}/{ch.total}
                                                    </span>
                                                    <Progress
                                                        value={ch.total > 0 ? (ch.completed / ch.total) * 100 : 0}
                                                        className="h-1.5 w-20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quiz Results */}
                                {course.quizResults.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <FileQuestion className="h-4 w-4" /> Quiz Results
                                        </h4>
                                        <div className="grid gap-2">
                                            {course.quizResults.map((quiz) => (
                                                <div key={quiz.quizId} className="flex items-center justify-between rounded-lg border px-4 py-2">
                                                    <span className="text-sm">{quiz.title}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted-foreground">
                                                            {quiz.totalAttempts} attempt{quiz.totalAttempts !== 1 ? "s" : ""}
                                                        </span>
                                                        {quiz.totalAttempts > 0 ? (
                                                            <Badge
                                                                variant="outline"
                                                                className={quiz.passed
                                                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                                    : "bg-red-500/15 text-red-400 border-red-500/30"
                                                                }
                                                            >
                                                                Best: {quiz.bestScore}/{quiz.maxScore}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-muted-foreground">
                                                                Not attempted
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Activity Completions */}
                                {course.activityResults.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <ListTodo className="h-4 w-4" /> Activities
                                        </h4>
                                        <div className="grid gap-2">
                                            {course.activityResults.map((act) => (
                                                <div key={act.activityId} className="flex items-center justify-between rounded-lg border px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        {act.completed ? (
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <span className="text-sm">{act.title}</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {act.type}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
