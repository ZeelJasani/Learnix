/**
 * DeleteCourseClient Component — Course delete confirmation card with destructive action
 * DeleteCourseClient Component — Course delete confirmation card with destructive action
 *
 * Aa client component chhe je course delete karva mate confirmation UI provide kare chhe
 * This is a client component that provides confirmation UI for deleting a course
 *
 * Features:
 * - Warning card — AlertTriangle icon sathe permanent delete warning message
 *   Warning card — Permanent delete warning message with AlertTriangle icon
 * - deleteCourse server action — Arcjet-protected course deletion
 * - Cancel link — /admin/courses par back navigate
 *   Cancel link — Navigates back to /admin/courses
 * - Loading state — Loader2 spinner while delete in progress
 * - Toast feedback — Success message + redirect to courses list
 * - tryCatch wrapper — Error handling for server action
 */
"use client";

import { tryCatch } from "@/hooks/try-catch";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteCourseClient({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === 'success') {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Delete course</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this course and remove its data from our servers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="text-sm leading-relaxed">
              You are about to permanently delete this course. Please confirm you want to proceed.
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/courses">
            Cancel
          </Link>

          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete course
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
