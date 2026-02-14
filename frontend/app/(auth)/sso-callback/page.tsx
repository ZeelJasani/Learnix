/**
 * SSO Callback Page — OAuth redirect handler
 * SSO Callback Page — OAuth redirect handler
 *
 * Aa client component chhe je Google/GitHub OAuth sign-in/sign-up pachhi redirect handle kare chhe
 * This is a client component that handles redirects after Google/GitHub OAuth sign-in/sign-up
 *
 * Flow:
 * 1. Clerk loaded chhe ke nahi te check kare chhe — signIn ane signUp hooks ready thay te pahela wait kare chhe
 *    Checks if Clerk is loaded — Waits until signIn and signUp hooks are ready
 * 2. Transferable sign-in handle kare chhe — Existing account ne new sign-up ma transfer kare chhe
 *    Handles transferable sign-in — Transfers existing account to new sign-up
 * 3. Regular OAuth callback process kare chhe — Sign-in redirect complete kare chhe
 *    Processes regular OAuth callback — Completes sign-in redirect
 * 4. Sign-up callback fallback kare chhe — Navo user sign-up flow handle kare chhe
 *    Falls back to sign-up callback — Handles new user sign-up flow
 * 5. Error par /login par redirect kare chhe — Graceful error recovery
 *    Redirects to /login on error — Graceful error recovery
 *
 * Loading indicator batave chhe jabsudhi process complete thay — Loader2 spinning icon
 * Shows loading indicator while process completes — Loader2 spinning icon
 */
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
