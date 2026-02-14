"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Loader2, Video } from "lucide-react";
import { toast } from "sonner";

interface Course {
    _id: string;
    title: string;
}

interface CreateSessionDialogProps {
    courses: Course[];
    onSessionCreated: () => void;
}

export function CreateSessionDialog({ courses, onSessionCreated }: CreateSessionDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        courseId: "",
        startsAt: "",
        durationMinutes: "60"
    });

    // Form submit handle karva mate
    // To handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.courseId) {
            toast.error("Please select a course");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/live-sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    courseIdOrSlug: formData.courseId,
                    durationMinutes: parseInt(formData.durationMinutes)
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create session");

            toast.success("Live session scheduled successfully");
            setOpen(false);
            setFormData({
                title: "",
                description: "",
                courseId: "",
                startsAt: "",
                durationMinutes: "60"
            });
            onSessionCreated();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to create session");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Schedule Session
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Schedule Live Session</DialogTitle>
                    <DialogDescription>
                        Create a new live session for a specific course.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Session Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Weekly Q&A Session"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Select
                            value={formData.courseId}
                            onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course._id} value={course._id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startsAt">Start Time</Label>
                            <div className="relative">
                                <Input
                                    id="startsAt"
                                    type="datetime-local"
                                    value={formData.startsAt}
                                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                                    required
                                    className="block"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="15"
                                step="15"
                                value={formData.durationMinutes}
                                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What will be covered in this session?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Schedule Session
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
