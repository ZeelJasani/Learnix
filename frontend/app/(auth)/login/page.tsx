/**
 * Login Page — User sign-in page
 * Login Page — User sign-in page
 *
 * Aa server component chhe je authenticated users ne home par redirect kare chhe
 * This is a server component that redirects authenticated users to home
 *
 * - Clerk auth() thi userId check kare chhe — Already logged-in users ne redirect kare chhe
 * - Clerk auth() checks userId — Redirects already logged-in users
 * - SignInForm component render kare chhe — Email/password ane OAuth sign-in options
 * - Renders SignInForm component — Email/password and OAuth sign-in options
 */
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInForm } from "../_components/SignInForm";

export default async function LoginPage() {
    const { userId } = await auth();
    if (userId) {
        return redirect("/");
    }

    return <SignInForm />;
}