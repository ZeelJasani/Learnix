import { adminGetCoursesWithContent } from "@/app/data/admin/admin-get-lessons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, FileVideo, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminLessonsPage() {
    const courses = await adminGetCoursesWithContent();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Lessons</h1>
                    <p className="text-sm text-muted-foreground">All lessons grouped by course and chapter</p>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                    No courses found.
                </div>
            ) : (
                <div className="space-y-4">
                    {courses.map((course) => (
                        <Card key={course._id} className="overflow-hidden border-border/60">
                            <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/20 border-b border-border/40">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold truncate">{course.title}</h3>
                                            <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                                                {course.status}
                                            </Badge>
                                        </div>
                                        {course.smallDescription && (
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{course.smallDescription}</p>
                                        )}
                                    </div>
                                </div>
                                {course.userId && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-muted-foreground hidden sm:block">{course.userId.name || 'Unknown'}</span>
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={course.userId.image || ""} />
                                            <AvatarFallback className="text-[8px]">
                                                {course.userId.name?.slice(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="p-0">
                                {(!course.chapters || course.chapters.length === 0) ? (
                                    <div className="p-6 text-center text-xs text-muted-foreground">
                                        No chapters added yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40">
                                        {course.chapters.map((chapter: any) => (
                                            <div key={chapter._id} className="py-3 px-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{chapter.title}</span>
                                                </div>
                                                <div className="ml-5 space-y-0.5">
                                                    {(!chapter.lessons || chapter.lessons.length === 0) ? (
                                                        <p className="text-xs text-muted-foreground/60 italic py-1">No lessons</p>
                                                    ) : (
                                                        chapter.lessons.map((lesson: any) => (
                                                            <div
                                                                key={lesson._id}
                                                                className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group"
                                                            >
                                                                <FileVideo className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                                <span className="text-sm flex-1 truncate group-hover:text-foreground transition-colors">
                                                                    {lesson.title}
                                                                </span>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    {lesson.duration && (
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                                                                        </span>
                                                                    )}
                                                                    <Badge variant={lesson.isFree ? "secondary" : "outline"} className="text-[9px] h-4 px-1.5">
                                                                        {lesson.isFree ? "Free" : "Locked"}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
