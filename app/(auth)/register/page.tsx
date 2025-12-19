import { auth } from "@clerk/nextjs/server";
import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        afterSignUpUrl="/"
        afterSignInUrl="/"
      />
    </div>
  );
}
