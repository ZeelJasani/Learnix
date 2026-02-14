/**
 * NewChapterModel Component — Course ma navo chapter create karva mate dialog
 * NewChapterModel Component — Dialog for creating new chapter in a course
 *
 * Aa component chhe je CourseStructure ma "New Chapter" button click par dialog open kare chhe
 * This component opens a dialog when "New Chapter" button is clicked in CourseStructure
 *
 * Features:
 * - react-hook-form + Zod validation — chapterSchema based form
 * - createChapter server action — Backend API thi chapter create kare chhe
 *   createChapter server action — Creates chapter via backend API
 * - Dialog state management — Open/close with form reset on close
 * - Loading state — Loader2 spinner while creating
 * - tryCatch wrapper — Error handling for server action
 * - Toast feedback — Success/error messages via sonner
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchemas";
import { Plus, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createChapter } from "../actions";
import { tryCatch } from "@/hooks/try-catch";

export function NewChapterModel({ courseId }: { courseId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
        },
    });

    async function onSubmit(values: ChapterSchemaType) {
        startTransition(async () => {
            try {
                const { data: result, error } = await tryCatch(createChapter({ ...values, courseId }));

                if (error) {
                    toast.error("An error occurred. Please try again later");
                    return;
                }

                if (result?.status === "success") {
                    toast.success("Chapter created successfully");
                    form.reset();
                    setIsOpen(false);
                } else if (result?.status === 'error') {
                    toast.error(result.message || "Failed to create chapter");
                }
            } catch (err) {
                console.error('Unexpected error in onSubmit:', err);
                toast.error("An unexpected error occurred");
            }
        });
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 flex items-center">
                    <Plus className="size-4" /> New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Form validation errors:", JSON.stringify(errors, null, 2)))} className="space-y-8">
                        <DialogHeader>
                            <DialogTitle>Create New Chapter</DialogTitle>
                            <DialogDescription>
                                What would you like to name your chapter?
                            </DialogDescription>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Chapter Name"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}