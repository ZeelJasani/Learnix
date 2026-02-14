/**
 * LessonForm Component — Lesson configuration edit form with video/thumbnail upload
 * LessonForm Component — Lesson configuration edit form with video/thumbnail upload
 *
 * Aa client component chhe je admin/mentor ne lesson ni details update karva de chhe
 * This is a client component that allows admin/mentor to update lesson details
 *
 * Features:
 * - react-hook-form + Zod validation — lessonSchema based form
 * - Pre-filled form — Existing lesson data thi form pre-populate thay chhe
 *   Pre-filled form — Form pre-populates with existing lesson data
 * - Form fields — Lesson Name, Description (RichTextEditor), Thumbnail (Uploader), Video (Uploader)
 * - updateLesson server action — Backend API thi lesson update kare chhe
 *   updateLesson server action — Updates lesson via backend API
 * - Admin/Mentor path auto-detect — pathname based basePath for "Go Back" link
 * - Loading state — Loader2 spinner while saving
 * - Toast feedback — Success/error messages via sonner
 */
"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { updateLesson } from "../actions";



interface iAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}



export function LessonForm({ chapterId, data, courseId }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const isMentor = pathname?.startsWith("/mentor");
  const basePath = isMentor ? "/mentor" : "/admin";

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      videoKey: data.videoKey ?? undefined,
      thumbnail: data.thumbnailKey ?? undefined,
    },
  });

  const onSubmit = (values: lessonSchemaType) => {
    startTransition(async () => {
      try {
        const result = await updateLesson({
          lessonId: data.id,
          data: values,
          courseId: courseId,
        });

        if (result.status === "success") {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to update lesson");
        console.error("Error updating lesson:", error);
      }
    });
  };
  return (
    <div className="mt-8">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`${basePath}/courses/${courseId}/edit`}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>


      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Uploader onChange={field.onChange} value={field.value || ""} fileTypeAccepted="image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <Uploader onChange={field.onChange} value={field.value || ""} fileTypeAccepted="video" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Lesson"
                )}
              </Button>
            </form>

          </Form>
        </CardContent>
      </Card>
    </div>
  );
}