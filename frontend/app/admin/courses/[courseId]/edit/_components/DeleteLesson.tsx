/**
 * DeleteLesson Component — Lesson delete karva mate confirmation AlertDialog
 * DeleteLesson Component — Confirmation AlertDialog for deleting a lesson
 *
 * Aa component chhe je CourseStructure ma lesson ni baaju ma Trash2 icon button provide kare chhe
 * This component provides a Trash2 icon button next to the lesson in CourseStructure
 *
 * Features:
 * - AlertDialog — "Are you absolutely sure?" confirmation popup
 * - deleteLesson server action — Backend API thi lesson permanently delete kare chhe
 *   deleteLesson server action — Permanently deletes lesson via backend API
 * - Props: chapterId, courseId, lessonId — Lesson identify karva mate required
 *   Props: chapterId, courseId, lessonId — Required to identify the lesson
 * - tryCatch wrapper — Server action error handling
 * - Loading state — "Deleting..." text while pending
 * - Revalidates admin + mentor course edit paths
 */
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteLesson } from "../actions";

export function DeleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteLesson({ chapterId, courseId, lessonId })
      );


      if (error) {
        console.error('Error in form submission:', error);
        toast.error("An error occurred. Please try again later");
        return;
      }

      if (result.status === "success") {
        toast.success(result.status);
        setOpen(false);
      } else if (result.status === 'error') {
        toast.error(result.message);
      }


    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          disabled={pending}
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            lesson and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            onClick={onSubmit}
            disabled={pending}
            variant="destructive"
          >
            {pending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}