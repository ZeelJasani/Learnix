"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, FileText, FileQuestion, Video, BookOpen, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

const activityTypes = [
    { value: "assignment", label: "Assignment", icon: FileText },
    { value: "quiz", label: "Quiz", icon: FileQuestion },
    { value: "project", label: "Project", icon: Layout },
    { value: "reading", label: "Reading", icon: BookOpen },
    { value: "video", label: "Video", icon: Video },
]

interface CreateActivityDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableCourses: { _id?: string; id?: string; title: string }[]
    preSelectedCourseId: string | null
    onCreated: () => void
}

export function CreateActivityDialog({ open, onOpenChange, availableCourses, preSelectedCourseId, onCreated }: CreateActivityDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState(preSelectedCourseId || "")
    const [type, setType] = useState("assignment")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setType("assignment")
        setStartDate("")
        setDueDate("")
        setSelectedCourseId(preSelectedCourseId || "")
    }

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error("Title is required")
        if (!selectedCourseId) return toast.error("Select a course")

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    type,
                    courseId: selectedCourseId,
                    startDate: startDate || undefined,
                    dueDate: dueDate || undefined,
                }),
            })
            if (!res.ok) throw new Error()
            toast.success("Activity created")
            resetForm()
            onOpenChange(false)
            onCreated()
        } catch {
            toast.error("Failed to create activity")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base">Create Activity</DialogTitle>
                    <DialogDescription className="text-sm">Add a new activity to a course</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Course */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Course</Label>
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select a course..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCourses.map((c) => (
                                    <SelectItem key={c._id || c.id} value={(c._id || c.id)!}>
                                        {c.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {activityTypes.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setType(t.value)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border text-xs transition-colors",
                                        type === t.value
                                            ? "border-primary bg-primary/5 text-foreground"
                                            : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30"
                                    )}
                                >
                                    <t.icon className="h-4 w-4" />
                                    <span className="text-[10px]">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" className="h-9 text-sm" />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="text-sm resize-none" rows={2} />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Start Date</Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">End Date</Label>
                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9 text-sm" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                        Create
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
