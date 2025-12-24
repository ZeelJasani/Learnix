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