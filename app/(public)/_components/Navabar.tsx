// "use client";




// import Image from "next/image";
// import Link from "next/link";
// // import Logo from "@/public/logo.png";
// import heart from "@/public/newog.png";
// import { ZeelThemeToggle } from "@/components/ui/ZeelThemeToggle";
// import { authClient } from "@/lib/auth-client";
// import { buttonVariants } from "@/components/ui/button";
// import UserDropdown from "./UserDropdown";

// const navigationItems = [
//     { name: 'Home', href: "/" },
//     { name: 'Courses', href: "/courses" },
//     { name: 'Dashboard', href: "/dashboard" }
// ]

// export function Navbar() {
//     const {data: session, isPending} = authClient.useSession()
//     return (
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
//             <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
//                 <Link href="/" className="flex items-center space-x-2 mr-4">
//                     <Image src={heart} alt="Logo" className="size-9" />
//                     <span className="font-bold">masterji - lms</span>
//                 </Link>
//                 <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
//                 <div className="flex items-center space-x-2">
//                     {navigationItems.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.href}
//                             className="text-sm font-medium transition-colors hover:text-primary"
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                 </div>
//                 <div className="flex items-center">
//                     <ZeelThemeToggle />

//                     {isPending ? null : session ? (
//                     <UserDropdown 
//                         email={session.user.email} 
//                         image={session.user.image || ""}
//                         name={session.user.name}    
//                     />
//                         // <p>logged in</p>
//                     ) : (
//                         <>
//                           <Link href="/login" className={buttonVariants({ variant: "secondary" })}
//                         >
//                             Login 
//                           </Link>
//                           <Link href="/login" className={buttonVariants()}
//                         >
//                             Get Started 
//                           </Link>   
//                         </>
//                     )}
//                 </div>
//             </nav>
//             </div>

//         </header>


//     );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
// import heart from "@/public/newog.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navigationItems = [
    { name: 'Home', href: "/" },
    { name: 'Courses', href: "/courses" },
    { name: 'Dashboard', href: "/dashboard" }
]
// console.log(navigationItems);

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2 mr-4">
                    <Image src="/masterji.png" alt="Logo" width={36} height={36} className="size-9" />
                    <span className="font-bold">Learnix</span>
                </Link>
                <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4"> {/* Added gap-4 here for spacing */}
                        <ThemeToggle />

                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <SignedOut>
                            <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
                                Login
                            </Link>
                            <Link href="/register" className={buttonVariants()}>
                                Register
                            </Link>
                        </SignedOut>
                    </div>
                </nav>
            </div>
        </header>
    );
}