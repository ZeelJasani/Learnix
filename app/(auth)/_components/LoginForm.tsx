"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GithubIcon, Loader, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
// import { start } from "repl";
// import { send } from "process";
import { useRouter } from "next/navigation";
export function LoginForm() {

    const router = useRouter();
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");

    async function signWIthGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("signed with github complete");
                    },
                    onError: () => {
                        toast.error("internal servel error")
                    },
                },
            });
        })
    }


    function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: 'sign-in',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('email sent successfully');
                        router.push(`/verify-request?email=${email}`);
                    },
                    onError: () => {
                        toast.error('failed to send email');
                    }
                },

            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-x1">Welcome back!</CardTitle>
                <CardDescription>Login with your Github Email Account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button
                    disabled={githubPending}
                    onClick={signWIthGithub}
                    className="w-full"
                    variant="outline"
                >
                    {githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin" />
                            <span>Loading...</span></>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign in with github
                        </>
                    )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>




                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="m@example.com"
                            required />
                    </div>

                    <Button
                        onClick={signInWithEmail}
                        disabled={emailPending}>
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                           <>
                            <Send className="size-4" />
                            <span>Continue with email</span>
                           </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}