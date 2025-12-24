"use client";

import { useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
    const { signIn, isLoaded: signInLoaded } = useSignIn();
    const { signUp, isLoaded: signUpLoaded } = useSignUp();
    const router = useRouter();

    useEffect(() => {
        if (!signInLoaded || !signUpLoaded) return;

        const handleCallback = async () => {
            try {
                // Try to handle sign-in callback first
                if (signIn?.firstFactorVerification?.status === "transferable") {
                    const result = await signUp?.create({ transfer: true });
                    if (result?.status === "complete") {
                        router.push("/");
                        return;
                    }
                }

                // Handle regular OAuth callback
                const signInAttempt = await signIn?.handleRedirectCallback?.();
                if (signInAttempt?.status === "complete") {
                    router.push("/");
                    return;
                }

                const signUpAttempt = await signUp?.handleRedirectCallback?.();
                if (signUpAttempt?.status === "complete") {
                    router.push("/");
                    return;
                }
            } catch {
                // On error, redirect to login
                router.push("/login");
            }
        };

        handleCallback();
    }, [signInLoaded, signUpLoaded, signIn, signUp, router]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
