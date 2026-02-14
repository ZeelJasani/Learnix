// Aa component landing page nu hero section render kare chhe (animated text ane CTA buttons sathe)
// This component renders the landing page hero section with animated text effects and call-to-action buttons
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}



export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden min-w-0">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-5xl px-6">
                            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                                {/* <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    // className="mt-6 max-w-2xl text-balance text-3xl font-medium sm:text-4xl md:text-5xl lg:mt-16 lg:text-6xl">
                                    className="mt-6 max-w-2xl text-3xl font-medium sm:text-4xl md:text-5xl lg:mt-16 lg:text-6xl">

                                    Master Your Skills with Learnix
                                </TextEffect> */}
                                <div className="mt-6 max-w-2xl lg:mt-16">
                                    <TextEffect
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        as="h1"
                                        className="text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl"
                                    >
                                        Master Your Skills
                                    </TextEffect>

                                    <TextEffect
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        delay={0.15}
                                        as="h1"
                                        className="text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl"
                                    >
                                        with Learnix
                                    </TextEffect>
                                </div>

                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mt-4 max-w-2xl text-pretty text-sm sm:mt-6 sm:text-base md:mt-8 md:text-lg">
                                    Discover a new way to learn with our modern, interactive learning management system. Access high-quality courses from industry experts anytime, anywhere.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-2 md:mt-12">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/courses">
                                                <span className="text-nowrap">Explore Courses</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-10.5 rounded-xl px-5 text-base">
                                        <Link href="/register">
                                            <span className="text-nowrap">Get Started Free</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>


                            </div>
                        </div>
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            {/* <div className="relative mt-8 overflow-hidden px-4 sm:mt-12 sm:px-6 md:mt-20"> */}
                            <div className="relative mt-8 overflow-hidden px-4 pb-16 sm:mt-12 sm:px-6 sm:pb-24 md:mt-20 md:pb-32">
                                <div className="bg-background relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl sm:rounded-2xl">

                                    {/* Light mode */}
                                    <Image
                                        className="relative w-full rounded-xl object-cover dark:hidden sm:rounded-2xl"
                                        src="/tempimage/learnix-dark.png"
                                        alt="app screen"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />

                                    {/* Dark mode */}
                                    <Image
                                        className="relative hidden w-full rounded-xl object-cover dark:block sm:rounded-2xl"
                                        src="/tempimage/learnix-light.png"
                                        alt="app screen"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />

                                </div>
                            </div>

                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}