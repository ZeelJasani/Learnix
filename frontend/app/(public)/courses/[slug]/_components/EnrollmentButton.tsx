"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { enrollInCourseAction } from "../actions";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2 } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
    const [pending, startTransition] = useTransition();


    // console.log(values);
    function onSubmit() {
        startTransition(async () => {
            // console.log('Starting enrollment process for course:', courseId);
            
            try {
                const { data: result, error } = await tryCatch(enrollInCourseAction(courseId));
                // console.log('Enrollment response:', { result, error });

                if (error) {
                    // console.error('Enrollment error:', {
                        // name: error.name,
                        // message: error.message,
                        // stack: error.stack,
                        // ...(error as any).code && { code: (error as any).code },
                        // ...(error as any).type && { type: (error as any).type },
                    // });
                    toast.error(error.message || "An unexpected error occurred");
                    return;
                }

                if (result?.status === 'success') {
                    // console.log('Enrollment successful:', result);
                    toast.success(result.message || 'Successfully enrolled in the course!');
                    
                    // If there's a redirect URL, navigate to it
                    if (result.redirectUrl) {
                        window.location.href = result.redirectUrl;
                        return;
                    }
                } else if (result?.status === 'error') {
                    // console.error('Enrollment failed with error status:', {
                        // message: result.message,
                        // status: result.status,
                        // result: JSON.stringify(result, null, 2)
                    // });
                    toast.error(result.message || 'Failed to enroll in the course');
                } else {
                    // console.error('Unexpected response format:', result);
                    toast.error('Unexpected response from server');
                }
            } catch (unexpectedError) {
                // console.error('Unexpected error in enrollment process:', {
                    // error: unexpectedError,
                    // stringified: JSON.stringify(unexpectedError, Object.getOwnPropertyNames(unexpectedError))
                // });
                toast.error('An unexpected error occurred during enrollment');
            }
        });
    }

    return (
        <Button onClick={onSubmit} disabled={pending} className="mt-6 w-full">
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                </>
            ) : (
                "Enroll Now"
            )}
        </Button>
    );
}