"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus, Search, Loader2, FileText, FileQuestion, Video,
    BookOpen, Layout, Trash2, MoreHorizontal, ChevronDown, ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import { CreateActivityDialog } from "./_components/create-activity-dialog"
import { cn } from "@/lib/utils"
import { useConstructUrl } from "@/hooks/use-construct-url"
import Image from "next/image"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface CourseType {
    _id: string
    id?: string
    title: string
    fileKey?: string
    status?: string
}

interface ActivityType {
    _id: string
    title: string
    description?: string
    type: string
    courseId: string | { _id: string; title: string }
    dueDate?: string
    startDate?: string
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

// Course card with its activities
function CourseActivityCard({
    course,
    activities,
    onAddActivity,
    onDeleteActivity,
    deletingId,
}: {
    course: CourseType
    activities: ActivityType[]
    onAddActivity: (courseId: string) => void
    onDeleteActivity: (id: string) => void
    deletingId: string | null
}) {
    const imageUrl = useConstructUrl(course.fileKey || "")
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="border border-border/50 rounded-lg overflow-hidden hover:border-border/80 transition-colors">
            {/* Course header */}
            <div className="flex items-start gap-3 px-4 py-3">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                >
                    {expanded
                        ? <ChevronDown className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />
                    }
                </button>

                {course.fileKey && (
                    <Image
                        src={imageUrl}
                        alt=""
                        width={36}
                        height={24}
                        className="rounded object-cover w-9 h-6 shrink-0 mt-0.5"
                    />
                )}

                <div className="flex-1">
                    <p className="text-sm font-medium break-words">{course.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                        {activities.length} {activities.length === 1 ? "activity" : "activities"}
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 shrink-0"
                    onClick={() => onAddActivity(course._id || course.id || "")}
                >
                    <Plus className="h-3 w-3" />
                    Add Activity
                </Button>
            </div>

            {/* Activities list */}
            {expanded && (
                <div className="border-t border-border/30">
                    {activities.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-xs text-muted-foreground">No activities yet</p>
                        </div>
                    ) : (
                        activities.map((activity, i) => {
                            const Icon = typeIcons[activity.type?.toLowerCase()] || FileText
                            const colorClass = typeColors[activity.type?.toLowerCase()] || "text-muted-foreground"

                            return (
                                <div
                                    key={activity._id}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/20 transition-colors group",
                                        i < activities.length - 1 && "border-b border-border/20"
                                    )}
                                >
                                    <Icon className={cn("h-3.5 w-3.5 shrink-0", colorClass)} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium truncate">{activity.title}</p>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                                        {activity.type?.toLowerCase()}
                                    </span>
                                    {activity.dueDate && (
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {new Date(activity.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                            >
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem
                                                onClick={() => onDeleteActivity(activity._id)}
                                                className="text-destructive focus:text-destructive text-xs"
                                                disabled={deletingId === activity._id}
                                            >
                                                {deletingId === activity._id
                                                    ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                                    : <Trash2 className="h-3 w-3 mr-1.5" />
                                                }
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}

export default function AdminActivitiesPage() {
    const [courses, setCourses] = useState<CourseType[]>([])
    const [activities, setActivities] = useState<ActivityType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogCourseId, setDialogCourseId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [coursesRes, activitiesRes] = await Promise.all([
                fetch("/api/admin/courses"),
                fetch("/api/admin/activities"),
            ])
            const coursesData = await coursesRes.json()
            const activitiesData = await activitiesRes.json()

            const coursesList = coursesData?.data?.courses || coursesData?.courses || []
            setCourses(coursesList)
            const raw = activitiesData?.activities
            setActivities(Array.isArray(raw) ? raw : [])
        } catch {
            toast.error("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    // Group activities by course
    const courseActivitiesMap = useMemo(() => {
        const map: Record<string, ActivityType[]> = {}
        activities.forEach((a) => {
            if (!a.courseId) return
            const courseId = typeof a.courseId === "object" ? a.courseId?._id : a.courseId
            if (!map[courseId]) map[courseId] = []
            map[courseId].push(a)
        })
        return map
    }, [activities])

    // Filter courses by search
    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses
        const q = searchQuery.toLowerCase()
        return courses.filter((c) => {
            if (c.title.toLowerCase().includes(q)) return true
            const acts = courseActivitiesMap[c._id || c.id || ""] || []
            return acts.some(a => a.title.toLowerCase().includes(q))
        })
    }, [courses, searchQuery, courseActivitiesMap])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            const res = await fetch(`/api/admin/activities/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast.success("Activity deleted")
            fetchData()
        } catch {
            toast.error("Failed to delete activity")
        } finally {
            setDeletingId(null)
        }
    }

    const openCreateDialog = (courseId: string | null) => {
        setDialogCourseId(courseId)
        setDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Activities</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {activities.length} activities across {courses.length} courses
                    </p>
                </div>
                <Button size="sm" onClick={() => openCreateDialog(null)}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Activity
                </Button>
            </div>

            {/* Search */}
            <div className="mb-5">
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search courses or activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-8 text-xs"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-sm text-muted-foreground">No courses found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {(showAll ? filteredCourses : filteredCourses.slice(0, 5)).map((course) => {
                        const courseId = course._id || course.id || ""
                        const courseActivities = courseActivitiesMap[courseId] || []

                        return (
                            <CourseActivityCard
                                key={courseId}
                                course={course}
                                activities={courseActivities}
                                onAddActivity={openCreateDialog}
                                onDeleteActivity={handleDelete}
                                deletingId={deletingId}
                            />
                        )
                    })}

                    {filteredCourses.length > 5 && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? "Show Less" : `Show More (${filteredCourses.length - 5} more)`}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <CreateActivityDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                availableCourses={courses}
                preSelectedCourseId={dialogCourseId}
                onCreated={fetchData}
            />
        </div>
    )
}
