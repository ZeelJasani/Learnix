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

import { headers } from "next/headers";
import { LoginForm } from "../_components/LoginForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
// import { authClient } from "@/lib/auth-client";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        return redirect("/");
    }

    return <LoginForm />;
}