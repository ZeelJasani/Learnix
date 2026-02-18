"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
    Loader2, FileText, FileQuestion, Video, BookOpen, Layout,
    Upload, X, Plus, Link as LinkIcon, File, Radio
} from "lucide-react"
import { cn } from "@/lib/utils"

const activityTypes = [
    { value: "assignment", label: "Assignment", icon: FileText, description: "Upload PDF with dates" },
    { value: "quiz", label: "Quiz", icon: FileQuestion, description: "Create a quiz" },
    { value: "project", label: "Project", icon: Layout, description: "Multiple documents" },
    { value: "reading", label: "Reading", icon: BookOpen, description: "Blog link or PDF" },
    { value: "video", label: "Video", icon: Video, description: "Upload a video" },
    { value: "live_session", label: "Live Session", icon: Radio, description: "Schedule a live session" },
]

interface CreateActivityDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableCourses: { _id?: string; id?: string; title: string }[]
    preSelectedCourseId: string | null
    onCreated: () => void
}

// Simple file upload component using S3 presigned URLs
function FileUploadZone({ accept, label, files, onFilesChange, multiple = false }: {
    accept: string
    label: string
    files: { file: File; key: string; uploading: boolean; progress: number }[]
    onFilesChange: (files: { file: File; key: string; uploading: boolean; progress: number }[]) => void
    multiple?: boolean
}) {
    const [isDragging, setIsDragging] = useState(false)

    const uploadFile = useCallback(async (file: File) => {
        const fileEntry = { file, key: "", uploading: true, progress: 0 }
        onFilesChange([...files, fileEntry])

        try {
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: false,
                }),
            })

            if (!presignedResponse.ok) throw new Error("Failed to get upload URL")
            const { presignedUrl, key, contentType } = await presignedResponse.json()

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100)
                        onFilesChange([...files, { ...fileEntry, progress }])
                    }
                }
                xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject()
                xhr.onerror = () => reject(new Error("Upload failed"))
                xhr.open("PUT", presignedUrl, true)
                xhr.setRequestHeader("Content-Type", contentType || file.type)
                xhr.send(file)
            })

            onFilesChange([...files, { file, key, uploading: false, progress: 100 }])
            toast.success(`${file.name} uploaded`)
        } catch {
            toast.error(`Failed to upload ${file.name}`)
            // Remove the failed file
            onFilesChange(files)
        }
    }, [files, onFilesChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files)
        if (!multiple && droppedFiles.length > 1) {
            toast.error("Only one file allowed")
            return
        }
        droppedFiles.forEach(f => uploadFile(f))
    }, [multiple, uploadFile])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        selectedFiles.forEach(f => uploadFile(f))
        e.target.value = ""
    }, [uploadFile])

    const removeFile = useCallback(async (index: number) => {
        const file = files[index]
        if (file.key) {
            try {
                await fetch("/api/s3/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: file.key }),
                })
            } catch { /* ignore */ }
        }
        onFilesChange(files.filter((_, i) => i !== index))
    }, [files, onFilesChange])

    return (
        <div className="space-y-2">
            {/* Upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative border border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-border"
                )}
                onClick={() => document.getElementById("file-upload-input")?.click()}
            >
                <input
                    id="file-upload-input"
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="hidden"
                />
                <Upload className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>

            {/* Uploaded files */}
            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-border/40">
                            <File className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs truncate flex-1">{f.file.name}</span>
                            {f.uploading ? (
                                <span className="text-[10px] text-muted-foreground">{f.progress}%</span>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); removeFile(i) }} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Links input component
function LinksInput({ links, onLinksChange }: { links: string[]; onLinksChange: (links: string[]) => void }) {
    const [inputValue, setInputValue] = useState("")

    const addLink = () => {
        const trimmed = inputValue.trim()
        if (!trimmed) return
        if (!/^https?:\/\/.+/.test(trimmed)) {
            toast.error("Please enter a valid URL starting with http:// or https://")
            return
        }
        onLinksChange([...links, trimmed])
        setInputValue("")
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                    placeholder="https://example.com/article"
                    className="h-8 text-xs flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-8 px-2">
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
            {links.length > 0 && (
                <div className="space-y-1.5">
                    {links.map((link, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-border/40">
                            <LinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                            <a href={link} target="_blank" rel="noopener" className="text-xs truncate flex-1 text-primary hover:underline">{link}</a>
                            <button onClick={() => onLinksChange(links.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export function CreateActivityDialog({ open, onOpenChange, availableCourses, preSelectedCourseId, onCreated }: CreateActivityDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState(preSelectedCourseId || "")
    const [type, setType] = useState("assignment")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [files, setFiles] = useState<{ file: File; key: string; uploading: boolean; progress: number }[]>([])
    const [links, setLinks] = useState<string[]>([])
    const [content, setContent] = useState("")
    const [sessionDuration, setSessionDuration] = useState("")

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setType("assignment")
        setStartDate("")
        setDueDate("")
        setSelectedCourseId(preSelectedCourseId || "")
        setFiles([])
        setLinks([])
        setContent("")
        setSessionDuration("")
    }

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error("Title is required")
        if (!selectedCourseId) return toast.error("Select a course")

        // Type-specific validation
        if (type === "assignment" && files.length === 0) {
            return toast.error("Please upload an assignment PDF")
        }
        if (type === "video" && files.length === 0) {
            return toast.error("Please upload a video")
        }

        const anyUploading = files.some(f => f.uploading)
        if (anyUploading) return toast.error("Please wait for uploads to complete")

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    type: type.toUpperCase(),
                    courseId: selectedCourseId,
                    startDate: startDate ? (type === "live_session" ? new Date(startDate).toISOString() : startDate) : undefined,
                    dueDate: dueDate || undefined,
                    fileKeys: files.map(f => f.key).filter(Boolean),
                    links: links.length > 0 ? links : undefined,
                    content: content.trim() || undefined,
                    durationMinutes: sessionDuration ? Number(sessionDuration) : undefined,
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

    const selectedType = activityTypes.find(t => t.value === type)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-base">Create Activity</DialogTitle>
                    <DialogDescription className="text-xs">Add a new activity to a course</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {/* Course */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Course</Label>
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger className="h-auto min-h-9 py-2 text-sm [&>span]:line-clamp-none [&>span]:text-left [&>span]:whitespace-normal">
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

                    {/* Type selector */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</Label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {activityTypes.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => { setType(t.value); setFiles([]); setLinks([]); setContent("") }}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg border transition-all",
                                        type === t.value
                                            ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                            : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/30"
                                    )}
                                >
                                    <t.icon className="h-4 w-4" />
                                    <span className="text-[10px] font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                        {selectedType && (
                            <p className="text-[10px] text-muted-foreground">{selectedType.description}</p>
                        )}
                    </div>

                    {/* Common: Title */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" className="h-9 text-sm" />
                    </div>

                    {/* Common: Description */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="text-sm resize-none" rows={2} />
                    </div>

                    {/* ============ TYPE-SPECIFIC FIELDS ============ */}

                    {type === "assignment" && (
                        <>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Assignment PDF</Label>
                                <FileUploadZone
                                    accept=".pdf,.doc,.docx"
                                    label="Drop PDF or click to upload"
                                    files={files}
                                    onFilesChange={setFiles}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Date</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">End Date</Label>
                                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9 text-sm" />
                                </div>
                            </div>
                        </>
                    )}

                    {type === "quiz" && (
                        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center space-y-2">
                            <FileQuestion className="h-6 w-6 mx-auto text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                After creating this activity, use the <strong>Create Quiz</strong> button to build your quiz with questions and answers.
                            </p>
                        </div>
                    )}

                    {type === "project" && (
                        <>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Project Documents</Label>
                                <FileUploadZone
                                    accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt,.md"
                                    label="Drop documents or click to upload (multiple)"
                                    files={files}
                                    onFilesChange={setFiles}
                                    multiple
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Project Details</Label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Describe the project requirements, deliverables, and evaluation criteria..."
                                    className="text-sm resize-none"
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Date</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Due Date</Label>
                                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9 text-sm" />
                                </div>
                            </div>
                        </>
                    )}

                    {type === "reading" && (
                        <>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Blog / Article Links</Label>
                                <LinksInput links={links} onLinksChange={setLinks} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Or Upload PDF / Docs</Label>
                                <FileUploadZone
                                    accept=".pdf,.doc,.docx,.epub"
                                    label="Drop reading material or click to upload"
                                    files={files}
                                    onFilesChange={setFiles}
                                    multiple
                                />
                            </div>
                        </>
                    )}

                    {type === "video" && (
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Upload Video</Label>
                            <FileUploadZone
                                accept="video/*"
                                label="Drop video file or click to upload"
                                files={files}
                                onFilesChange={setFiles}
                            />
                        </div>
                    )}

                    {type === "live_session" && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Time</Label>
                                    <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration (minutes)</Label>
                                    <Input type="number" min={10} placeholder="e.g. 60" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="h-9 text-sm" />
                                </div>
                            </div>
                            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center space-y-2">
                                <Radio className="h-6 w-6 mx-auto text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    This will create a live session that students can join. Set the start time and duration for the session.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
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
