"use client"

import { useEffect, useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle, XCircle, Eye, ClipboardCheck, BookOpen, ArrowLeft } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { SelectCourseCard } from "../_components/SelectCourseCard"

interface Submission {
    id: string
    student: {
        id: string
        name: string
        email: string
        image: string | null
    }
    lesson: {
        id: string
        title: string
    }
    course: string
    content: string
    status: "submitted" | "approved" | "rejected"
    createdAt: string
    updatedAt: string
}

interface Course {
    _id?: string
    id?: string
    title: string
    smallDescription?: string
    duration?: number | string
    level?: string
    status?: string
    price?: number
    fileKey?: string
    category?: string
}

const statusConfig = {
    submitted: { label: "Pending", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
    approved: { label: "Approved", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    rejected: { label: "Rejected", color: "bg-red-500/15 text-red-400 border-red-500/30" },
}

export default function MentorSubmissionsPage() {
    const { getToken } = useAuth()
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>("all")
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
    const [reviewingId, setReviewingId] = useState<string | null>(null)
    const [viewSubmission, setViewSubmission] = useState<Submission | null>(null)

    const fetchSubmissionsAndCourses = useCallback(async () => {
        try {
            setLoading(true)
            const token = await getToken()
            const url = filter === "all"
                ? `${process.env.NEXT_PUBLIC_API_URL}/mentor/submissions`
                : `${process.env.NEXT_PUBLIC_API_URL}/mentor/submissions?status=${filter}`

            const [submissionsRes, coursesRes] = await Promise.all([
                fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/courses`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const jsonSubmissions = await submissionsRes.json()
            const jsonCourses = await coursesRes.json()

            setSubmissions(jsonSubmissions.data || [])
            setCourses(Array.isArray(jsonCourses.data) ? jsonCourses.data : (Array.isArray(jsonCourses) ? jsonCourses : []))
        } catch {
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }, [getToken, filter])

    useEffect(() => {
        fetchSubmissionsAndCourses()
    }, [fetchSubmissionsAndCourses])

    const handleReview = async (submissionId: string, status: "approved" | "rejected") => {
        try {
            setReviewingId(submissionId)
            const token = await getToken()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/mentor/submissions/${submissionId}/review`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            )

            if (!res.ok) throw new Error("Failed to review")

            toast.success(`Submission ${status} successfully`)
            setViewSubmission(null)
            fetchSubmissionsAndCourses()
        } catch {
            toast.error("Failed to review submission")
        } finally {
            setReviewingId(null)
        }
    }

    const filters = [
        { key: "all", label: "All" },
        { key: "submitted", label: "Pending" },
        { key: "approved", label: "Approved" },
        { key: "rejected", label: "Rejected" },
    ]

    if (selectedCourseId) {
        const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId)
        const courseSubmissions = submissions.filter(s => s.course === selectedCourse?.title)

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
                                <ClipboardCheck className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Submissions for {selectedCourse?.title}</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Review and grade student assignment submissions for this course
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {filters.map((f) => (
                            <Button
                                key={f.key}
                                variant={filter === f.key ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : courseSubmissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed">
                            <div className="p-3 rounded-lg bg-muted mb-4">
                                <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium mb-1">No submissions found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {filter === "submitted"
                                    ? "No pending submissions to review for this course."
                                    : "No submissions match the current filter for this course."}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">Avatar</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Lesson</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseSubmissions.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sub.student.image || ""} />
                                                    <AvatarFallback className="text-xs">
                                                        {sub.student.name?.slice(0, 2).toUpperCase() || "??"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{sub.student.name}</span>
                                                    <span className="text-xs text-muted-foreground">{sub.student.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-sm">{sub.lesson.title}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusConfig[sub.status]?.color}
                                                >
                                                    {statusConfig[sub.status]?.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setViewSubmission(sub)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {sub.status === "submitted" && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                                                                onClick={() => handleReview(sub.id, "approved")}
                                                                disabled={reviewingId === sub.id}
                                                            >
                                                                {reviewingId === sub.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-400 hover:text-red-300"
                                                                onClick={() => handleReview(sub.id, "rejected")}
                                                                disabled={reviewingId === sub.id}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* View Submission Dialog */}
                <Dialog open={!!viewSubmission} onOpenChange={() => setViewSubmission(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Submission Details</DialogTitle>
                            <DialogDescription>
                                {viewSubmission?.student.name} — {viewSubmission?.lesson.title}
                            </DialogDescription>
                        </DialogHeader>
                        {viewSubmission && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={viewSubmission.student.image || ""} />
                                        <AvatarFallback>
                                            {viewSubmission.student.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{viewSubmission.student.name}</p>
                                        <p className="text-sm text-muted-foreground">{viewSubmission.student.email}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`ml-auto ${statusConfig[viewSubmission.status]?.color}`}
                                    >
                                        {statusConfig[viewSubmission.status]?.label}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-medium mb-2">Submission Content</h4>
                                    <div className="rounded-lg border bg-muted/50 p-4 whitespace-pre-wrap text-sm">
                                        {viewSubmission.content}
                                    </div>
                                </div>

                                {viewSubmission.status === "submitted" && (
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReview(viewSubmission.id, "rejected")}
                                            disabled={!!reviewingId}
                                        >
                                            {reviewingId === viewSubmission.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <XCircle className="h-4 w-4 mr-2" />
                                            )}
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleReview(viewSubmission.id, "approved")}
                                            disabled={!!reviewingId}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {reviewingId === viewSubmission.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                            )}
                                            Approve
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
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
                        Choose a course to view and grade its submissions
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
                        You need to create a course first.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const courseId = course._id || course.id;
                        const courseSubmissionsCount = submissions.filter(s => s.course === course.title).length;
                        const pendingCount = submissions.filter(s => s.course === course.title && s.status === 'submitted').length;

                        return (
                            <SelectCourseCard
                                key={courseId}
                                data={course as any}
                                onClick={() => setSelectedCourseId(courseId as string)}
                                badgeText={pendingCount > 0 ? `${pendingCount} Pending` : `${courseSubmissionsCount} ${courseSubmissionsCount === 1 ? 'Submission' : 'Submissions'}`}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
