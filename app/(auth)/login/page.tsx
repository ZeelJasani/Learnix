// // "use client";


// import { headers } from "next/headers";
// import { LoginForm } from "../_components/LoginForm";
// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// // import { authClient } from "@/lib/auth-client";

// const session = await auth.api.getSession();

// export default async function LoginPage() {
//     // const session = auth.api.getSession({
//         headers: await headers(),
//     });

//     if(session) {
//         return redirect("/");
//     }
//     return <LoginForm />
// }





// "use client";

// import { auth } from "@lib/auth";
// import { LoginForm } from "./_components/LoginForm";
// import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function LoginPage() {
    const { userId } = await auth();
    if (userId) {
        return redirect("/");
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/register"
                afterSignInUrl="/"
                afterSignUpUrl="/"
            />
        </div>
    );
}