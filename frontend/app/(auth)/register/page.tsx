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
