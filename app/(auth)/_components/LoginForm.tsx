"use client";

import { SignIn } from "@clerk/nextjs";

export function LoginForm() {
  return (
    <SignIn
      routing="path"
      path="/login"
      signUpUrl="/register"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    />
  );
}