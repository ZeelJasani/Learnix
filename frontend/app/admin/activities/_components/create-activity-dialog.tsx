/**
 * CreateActivityDialog Component — New course activity create karva mate modal dialog
 * CreateActivityDialog Component — Modal dialog for creating new course activities
 *
 * Aa client component chhe je admin ne specific course mate activity create karva de chhe
 * This is a client component that allows admin to create activities for a specific course
 *
 * Features:
 * - Activity types — ASSIGNMENT, QUIZ, PROJECT, READING, VIDEO (grid selector buttons)
 * - Form fields — Title (required), Description (optional), Start Date, Due Date
 * - API POST — /api/admin/activities endpoint par data submit kare chhe
 *   API POST — Submits data to /api/admin/activities endpoint
 * - Form reset — Dialog close thay tyare form automatically reset thay chhe
 *   Form reset — Form automatically resets when dialog closes
 * - Validation — Title ane courseId required chhe
 *   Validation — Title and courseId are required
 * - onSuccess callback — Parent component ne refresh trigger kare chhe
 *   onSuccess callback — Triggers refresh in parent component
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Layout, BookOpen, Video, FileQuestion, School } from "lucide-react";
import { cn } from "@/lib/utils";

const activityTypes = [
    { value: "ASSIGNMENT", label: "Assignment", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-200" },
    { value: "QUIZ", label: "Quiz", icon: FileQuestion, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-200" },
    { value: "PROJECT", label: "Project", icon: Layout, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-200" },
    { value: "READING", label: "Reading", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-200" },
    { value: "VIDEO", label: "Video", icon: Video, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-200" },
];

interface Course {
    id: string;
    title: string;
}

interface CreateActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId?: string;
    courseTitle?: string;
    availableCourses?: Course[];
    onSuccess: () => void;
}

export function CreateActivityDialog({
    open,
    onOpenChange,
    courseId: initialCourseId,
    courseTitle,
    availableCourses = [],
    onSuccess
}: CreateActivityDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("ASSIGNMENT");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedCourseId(initialCourseId || "");
            if (!initialCourseId) resetForm();
        }
    }, [open, initialCourseId]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("ASSIGNMENT");
        setStartDate("");
        setDueDate("");
    };

    // Activity create karva mate nu logic
    // Logic to create a new activity
    const handleCreate = async () => {
        if (!title || !selectedCourseId) {
            toast.error("Please fill in required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    startDate: startDate || null,
                    dueDate: dueDate || null,
                    courseId: selectedCourseId
                })
            });

            if (!res.ok) throw new Error("Failed to create activity");

            toast.success("Activity created successfully");
            onOpenChange(false);
            resetForm();
            onSuccess();
        } catch {
            toast.error("Failed to create activity");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader className="text-left">
                    <DialogTitle>Create Activity</DialogTitle>
                    <DialogDescription>
                        {courseTitle ? (
                            <span className="flex items-center gap-1 font-medium text-primary">
                                <School className="h-3.5 w-3.5" />
                                {courseTitle}
                            </span>
                        ) : "Create a new activity for any course"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Course Selection (if not pre-selected) */}
                    {!initialCourseId && (
                        <div className="space-y-1.5">
                            <Label className="text-sm">Select Course *</Label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCourses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Activity Type */}
                    <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">Activity Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {activityTypes.map(t => {
                                const Icon = t.icon;
                                const isSelected = type === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setType(t.value)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                                            isSelected
                                                ? cn("border-2 shadow-sm", t.bg, t.border)
                                                : "border-border hover:bg-muted/50 hover:border-muted-foreground/20"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isSelected ? t.color : "text-muted-foreground")} />
                                        <span className={cn("text-xs font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                            {t.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-sm">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Activity title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-sm">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={2}
                            className="resize-none"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="startDate" className="text-sm">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dueDate" className="text-sm">End Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!title || !selectedCourseId || isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
