"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useUser, useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface FreeEnrollModalProps {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    children: React.ReactNode;
}

export function FreeEnrollModal({ courseId, courseTitle, courseSlug, children }: FreeEnrollModalProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.primaryEmailAddress?.emailAddress) {
            toast.error("You must be logged in to enroll");
            return;
        }

        if (email !== user.primaryEmailAddress.emailAddress) {
            toast.error("Email does not match your account email");
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Please login to continue");
                return;
            }

            const response = await api.post('/enrollments/free', {
                courseId,
                email
            }, token);

            if (response.success) {
                toast.success("Successfully enrolled!");
                setIsOpen(false);
                router.push(`/dashboard/${courseSlug}`);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to enroll");
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enroll in {courseTitle}</DialogTitle>
                    <DialogDescription>
                        This course is free! Please confirm your email address to enroll.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEnroll} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Must match your login email: <span className="font-medium text-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Enroll
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
