/* eslint-disable react-hooks/exhaustive-deps */
"use client"



import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

import { useAuth } from "@clerk/nextjs";

function PaymentSuccessContent() {
    const { triggerConfetti } = useConfetti();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const { getToken } = useAuth();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                // If no session ID, assume success (fallback or pre-update link)
                setStatus('success');
                triggerConfetti();
                return;
            }

            try {
                const token = await getToken();
                if (!token) {
                    console.error('No auth token available');
                    setStatus('error');
                    toast.error('Authentication failed. Please log in again.');
                    return;
                }

                const response = await api.post('/enrollments/verify', { sessionId }, token);
                if (response.success) {
                    setStatus('success');
                    triggerConfetti();
                } else {
                    console.error('Payment verification failed:', response);
                    setStatus('error');
                    toast.error('Could not verify payment. Please contact support.');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('error');
                toast.error('Something went wrong verifying your payment.');
            }
        };

        verifyPayment();
    }, [sessionId, triggerConfetti, getToken]);

    if (status === 'loading') {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center flex-col gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your enrollment...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center">
                <Card className="w-[350px]">
                    <CardContent>
                        <div className="w-full flex justify-center">
                            <XCircle className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
                        </div>
                        <div className="mt-3 text-center sm:mt-5 w-full">
                            <h2 className="text-xl font-semibold">Verification Failed</h2>
                            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                                We likely received your payment, but couldn't verify it instantly. Your course should appear shortly.
                            </p>
                            <Link
                                href="/dashboard"
                                className={buttonVariants({ className: "w-full mt-5" })}
                            >
                                <ArrowLeft className="size-4" />
                                Go to Dashboard
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="w-full flex justify-center">
                        <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Successful</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                            Congrats your payment was successful. You should now have access to the course!
                        </p>

                        <Link
                            href="/dashboard"
                            className={buttonVariants({ className: "w-full mt-5" })}
                        >
                            <ArrowLeft className="size-4" />
                            Go to Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessfull() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex flex-1 justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}