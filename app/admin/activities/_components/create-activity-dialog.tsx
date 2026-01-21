"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Course {
    id: string;
    title: string;
}

const activityTypes = [
    { value: "ASSIGNMENT", label: "Assignment" },
    { value: "QUIZ", label: "Quiz" },
    { value: "PROJECT", label: "Project" },
    { value: "READING", label: "Reading" },
    { value: "VIDEO", label: "Video" },
];

interface CreateActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    courseTitle: string;
    onSuccess: () => void;
}

export function CreateActivityDialog({
    open,
    onOpenChange,
    courseId,
    courseTitle,
    onSuccess
}: CreateActivityDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("ASSIGNMENT");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("ASSIGNMENT");
        setStartDate("");
        setDueDate("");
    };

    const handleCreate = async () => {
        if (!title || !courseId) {
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
                    courseId
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
                        {courseTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Activity Type */}
                    <div className="grid grid-cols-3 gap-2">
                        {activityTypes.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setType(t.value)}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all ${type === t.value
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:bg-muted"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
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
                        disabled={!title || isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
