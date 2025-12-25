'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ui/themeToggle'
import { UserDropdown } from '@/app/(public)/_components/UserDropdown'
import { useUserRole } from '@/hooks/use-user-role'

const baseMenuItems = [
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const { isAdmin } = useUserRole()

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full border-b bg-background">
                <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-2 lg:gap-0 lg:py-3">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {baseMenuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    <SignedIn>
                                        <li>
                                            <Link
                                                href="/dashboard"
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>Dashboard</span>
                                            </Link>
                                        </li>
                                        {isAdmin && (
                                            <li>
                                                <Link
                                                    href="/admin"
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>Admin</span>
                                                </Link>
                                            </li>
                                        )}
                                    </SignedIn>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {baseMenuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    <SignedIn>
                                        <li>
                                            <Link
                                                href="/dashboard"
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>Dashboard</span>
                                            </Link>
                                        </li>
                                        {isAdmin && (
                                            <li>
                                                <Link
                                                    href="/admin"
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>Admin</span>
                                                </Link>
                                            </li>
                                        )}
                                    </SignedIn>
                                </ul>
                            </div>

                            <div className="flex w-full flex-col items-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {/* Theme Toggle */}
                                <ThemeToggle />

                                {/* Show Login/Register when signed out */}
                                <SignedOut>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="/register">
                                            <span>Register</span>
                                        </Link>
                                    </Button>
                                </SignedOut>

                                {/* Show User Dropdown when signed in */}
                                <SignedIn>
                                    <UserDropdown />
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
