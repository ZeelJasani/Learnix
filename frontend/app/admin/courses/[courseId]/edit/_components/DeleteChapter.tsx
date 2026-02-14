/**
 * DeleteChapter Component — Chapter delete karva mate confirmation AlertDialog
 * DeleteChapter Component — Confirmation AlertDialog for deleting a chapter
 *
 * Aa component chhe je CourseStructure ma chapter ni baaju ma Trash2 icon button provide kare chhe
 * This component provides a Trash2 icon button next to the chapter in CourseStructure
 *
 * Features:
 * - AlertDialog — "Are you absolutely sure?" confirmation popup
 * - deleteChapter server action — Backend API thi chapter permanently delete kare chhe
 *   deleteChapter server action — Permanently deletes chapter via backend API
 * - tryCatch wrapper — Server action error handling
 * - Loading state — "Deleting..." text while pending
 * - Toast feedback — Success/error messages
 * - Revalidates admin + mentor course edit paths
 */
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteChapter } from "../actions";

export function DeleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      try {
        const { data: result, error } = await tryCatch(deleteChapter({ chapterId, courseId }));

        if (error) {
          console.error('Error deleting chapter:', error);
          toast.error(error.message || "An error occurred while deleting the chapter");
          return;
        }

        if (result?.status === "success") {
          toast.success(result.message || "Chapter deleted successfully");
          setOpen(false);
        } else {
          toast.error(result?.message || "Failed to delete chapter");
        }
      } catch (err) {
        console.error('Unexpected error in chapter deletion:', err);
        toast.error("An unexpected error occurred");
      }
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            chapter and remove the data from our servers.
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