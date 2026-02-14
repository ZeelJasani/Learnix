/**
 * Navbar Component — Public pages nu main navigation bar
 * Navbar Component — Main navigation bar for public pages
 *
 * Aa client component chhe je sticky header navigation provide kare chhe
 * This is a client component that provides sticky header navigation
 *
 * Features:
 * - Learnix logo ane branding — Home page par navigate kare chhe
 *   Learnix logo and branding — Navigates to home page
 * - Navigation links — Home, Courses, Dashboard
 * - ThemeToggle — Dark/light mode switch
 * - Clerk auth state:
 *   - SignedIn → UserDropdown (avatar, profile, admin, sign-out)
 *   - SignedOut → Login ane Register buttons
 * - Responsive — Desktop nav hidden on mobile (md: breakpoint)
 * - backdrop-blur effect — Semi-transparent background with blur
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UserDropdown } from "./UserDropdown";

const navigationItems = [
    { name: 'Home', href: "/" },
    { name: 'Courses', href: "/courses" },
    { name: 'Dashboard', href: "/dashboard" }
]


export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2 mr-4">
                    <Image src="/learnix.png" alt="Logo" width={36} height={36} className="size-9" />
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
                            <UserDropdown />
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