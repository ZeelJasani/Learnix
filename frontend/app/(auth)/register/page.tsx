/**
 * Register Page — New user registration page
 * Register Page — New user registration page
 *
 * Aa server component chhe je authenticated users ne home par redirect kare chhe
 * This is a server component that redirects authenticated users to home
 *
 * - Clerk auth() thi userId check kare chhe — Already logged-in users ne redirect kare chhe
 * - Clerk auth() checks userId — Redirects already logged-in users
 * - SignUpForm component render kare chhe — Name, email, password ane OAuth sign-up options
 * - Renders SignUpForm component — Name, email, password and OAuth sign-up options
 */
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpForm } from "../_components/SignUpForm";

export default async function RegisterPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }

  return <SignUpForm />;
}
