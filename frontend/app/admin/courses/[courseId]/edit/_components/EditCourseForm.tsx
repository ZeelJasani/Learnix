"use client";

import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { tryCatch } from "@/hooks/try-catch";
import { CourseSchemaType, courseSchema, courseCategories, courseLevels, courseStatus } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparkleIcon, Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { editCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface iAppProps {
    data: AdminCourseSingularType
}

export function EditCourseForm({ data }: iAppProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            fileKey: data.fileKey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            category: "Computer Science Fundamentals" as CourseSchemaType['category'],
            smallDescription: data.smallDescription,
            slug: data.slug,
            status: data.status
        },
    });

    const slugify = (titleValue: string): string => {
        return titleValue
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const onSubmit = (values: CourseSchemaType) => {
        startTransition(async () => {
            try {
                const { data: result, error } = await tryCatch(editCourse(values, data.id));

                if (error) {
                    toast.error("An unexpected error occurred");
                    return;
                }

                if (result?.status === 'success') {
                    toast.success(result.message);
                    form.reset();
                    router.push("/admin/courses");
                } else if (result?.status === "error") {
                    toast.error(result.message);
                }
            } catch (err) {
                toast.error("An unexpected error occurred");
                console.error(err);
            }
        });
    };

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="button"
                        className="w-fit"
                        onClick={() => {
                            const titleValue = form.getValues("title");
                            const slug = slugify(titleValue);
                            form.setValue("slug", slug, { shouldValidate: true });
                        }}
                    >
                        Generate Slug <SparkleIcon className="ml-1" size={16} />
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Small description"
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
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
                    name="fileKey"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                                {/* <Input placeholder="thumbnail url" {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Duration (hours)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Course Duration"
                                        type="number"
                                        min="1"
                                        max="500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Course Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Course Price"
                                        type="number"
                                        min="1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseStatus.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            Updating...
                            <Loader2 className="animate-spin" />
                        </>
                    ) : (
                        <>
                            Update Course <PlusIcon className="ml-1" size={16} />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}