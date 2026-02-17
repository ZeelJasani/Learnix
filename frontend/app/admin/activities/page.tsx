"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Loader2, Activity } from "lucide-react"
import { toast } from "sonner"
import { useConstructUrl } from "@/hooks/use-construct-url"
import Image from "next/image"
import { ActivityListItem } from "./_components/activity-list-item"
import { CreateActivityDialog } from "./_components/create-activity-dialog"

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
    completedCount?: number
}

function CourseCard({ course, isSelected, onClick }: { course: CourseType; isSelected: boolean; onClick: () => void }) {
    const imageUrl = useConstructUrl(course.fileKey || "")
    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-lg border p-3 transition-all duration-150 ${isSelected ? "border-primary bg-primary/5" : "border-border/60 hover:border-border hover:bg-muted/30"
                }`}
        >
            <div className="flex items-center gap-3">
                {course.fileKey && (
                    <Image src={imageUrl} alt="" width={40} height={28} className="rounded object-cover w-10 h-7 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{course.title}</p>
                    {course.status && (
                        <Badge variant="secondary" className="text-[9px] mt-0.5 h-4 px-1.5">{course.status}</Badge>
                    )}
                </div>
            </div>
        </button>
    )
}

const activityTypes = ["All", "Assignment", "Quiz", "Project", "Reading", "Video"]

export default function AdminActivitiesPage() {
    const [courses, setCourses] = useState<CourseType[]>([])
    const [activities, setActivities] = useState<ActivityType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogCourse, setDialogCourse] = useState<string | null>(null)

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
            setActivities(activitiesData?.activities || [])
        } catch {
            toast.error("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const filteredActivities = useMemo(() => {
        return activities.filter((a) => {
            const courseId = typeof a.courseId === "object" ? a.courseId._id : a.courseId
            if (selectedCourse && courseId !== selectedCourse) return false
            if (selectedType !== "All" && a.type?.toLowerCase() !== selectedType.toLowerCase()) return false
            if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
            return true
        })
    }, [activities, selectedCourse, selectedType, searchQuery])

    const openCreateDialog = (courseId: string | null) => {
        setDialogCourse(courseId)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/activities/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast.success("Activity deleted")
            fetchData()
        } catch {
            toast.error("Failed to delete activity")
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Activities</h1>
                        <p className="text-sm text-muted-foreground">{activities.length} total</p>
                    </div>
                </div>
                <Button size="sm" onClick={() => openCreateDialog(null)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create Activity
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* Course Sidebar */}
                    <div className="w-64 shrink-0 hidden lg:block space-y-2">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">Courses</h3>
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCourse ? "bg-muted font-medium" : "hover:bg-muted/50 text-muted-foreground"
                                }`}
                        >
                            All Courses
                        </button>
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id || course.id}
                                course={course}
                                isSelected={selectedCourse === (course._id || course.id)}
                                onClick={() => setSelectedCourse(course._id || course.id || null)}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search activities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                            <div className="flex gap-1">
                                {activityTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedType === type
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activity List */}
                        {filteredActivities.length === 0 ? (
                            <div className="text-center py-16 text-sm text-muted-foreground">
                                No activities found
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredActivities.map((activity) => (
                                    <ActivityListItem
                                        key={activity._id}
                                        activity={activity}
                                        onDelete={() => handleDelete(activity._id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <CreateActivityDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                availableCourses={courses}
                preSelectedCourseId={dialogCourse}
                onCreated={fetchData}
            />
        </div>
    )
}
