// import { ReactNode } from "react";

// export default function AuthLayout({ children }: { children: ReactNode }) {
//     return (
//         <div className="relative flex min-h-svh flex-col items-center justify-center">
//             <div className="flex w-full max-w-sm flex-col gap-6">
//                 {children}
//             </div>
//         </div>
//     );
// }






// import { buttonVariants } from "@/components/ui/button";
// import Link from "next/link"; // Import Link from next/link
// import { ArrowLeft } from "lucide-react";
// import { ReactNode } from "react";

// export default function AuthLayout({ children }: { children: ReactNode }) {
//     return (
//         <div className="relative flex min-h-svh flex-col items-center justify-center">

//             <Link href="/" className={buttonVariants({
//                 variant: "outline",
//                 className: "absolute top-4 left-4",
//             })}>
//                 <ArrowLeft className="size-4 mr-2" /> {/* Added mr-2 for spacing */}
//                 Back to home
//             </Link>


//             <div className="flex w-full max-w-sm flex-col gap-6">
//                 <link href="/">masterji.</link>
//                 {children}
//             </div>
//         </div>
//     );
// }



// gemini code 

// app > (auth) @ layout.tsx > AuthLayout
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link"; // Import Link from next/link
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import masterji from "@/public/masterji.png"; // Adjust the import path as necessary
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">

            <Link href="/" className={buttonVariants({
                variant: "outline",
                className: "absolute top-4 left-4",
            })}>
                <ArrowLeft className="size-4 mr-2" /> {/* Added mr-2 for spacing */}
                Back to home
            </Link>

            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* THIS IS THE CORRECTED LINE */}
                <Link className="flex items-center gap-2 self-center font-medium" href="/">
                    <Image src={masterji} alt="logo" width={32} height={32} />
                    masterji</Link>
                {children}


                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <span className="hover:text-primary hover:underline">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="hover:text-primary hover:underline">
                        Privacy Policy
                    </span>
                    .
                </div>
            </div>
        </div>
    );
}