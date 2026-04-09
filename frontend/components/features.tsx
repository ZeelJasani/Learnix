// Key features of the Learnix platform
// Redesigned using the "veil-features-2" modern layout
import { Card } from '@/components/ui/card'
import { Shield, GraduationCap } from 'lucide-react'
import { Vercel } from '@/components/ui/svgs/vercel'
import { Supabase } from '@/components/ui/svgs/supabase'
import { Linear } from '@/components/ui/svgs/linear'
import { Slack } from '@/components/ui/svgs/slack'
import { Firebase } from '@/components/ui/svgs/firebase'
import { ClerkIconDark as Clerk } from '@/components/ui/svgs/clerk'

export default function Features() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="text-center md:text-left">
                    <h2 className="text-balance font-serif text-4xl font-medium tracking-tight lg:text-5xl">
                        Powering Your Future in Tech
                    </h2>
                    <p className="text-muted-foreground mt-4 text-balance">
                        Advanced tools and curated curricula designed to help you master new skills and build a standout portfolio.
                    </p>
                </div>
                <div className="@xl:grid-cols-2 mt-12 grid gap-6 *:p-6">
                    {/* Feature 1: Industry-Standard Stack (Integration Visual) */}
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Industry-Led Mentorship</h3>
                            <p className="text-muted-foreground text-sm">
                                Master tools like React, Next.js, and Supabase with courses crafted by senior practitioners.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="**:fill-foreground flex h-44 flex-col justify-between pt-8"
                        >
                            <div className="relative flex h-10 items-center gap-12 px-6">
                                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Vercel className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Slack className="size-3.5" />
                                </div>
                            </div>
                            <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
                                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Clerk className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Linear className="size-3.5" />
                                </div>
                            </div>
                            <div className="relative flex h-10 items-center gap-20 px-8">
                                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Supabase className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring transition-transform hover:scale-110">
                                    <Firebase className="size-3.5" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Feature 2: Real-time Analytics (Sync Visual) */}
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Real-time Skill Tracking</h3>
                            <p className="text-muted-foreground text-sm">
                                Visualize your progress with data-driven dashboards that highlight your strengths and growth.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="relative h-44 translate-y-6"
                        >
                            <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
                            <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border border-border/50"></div>
                            <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border-2"></div>
                            <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border border-border/50"></div>
                            <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border-2 border-primary"></div>
                        </div>
                    </Card>

                    {/* Feature 3: Project-First (Developer visual) */}
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Project-First Methodology</h3>
                            <p className="text-muted-foreground mt-2 text-sm">
                                Gain practical experience by building real-world applications that demonstrate your technical proficiency.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="*:bg-foreground/15 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px"
                        >
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="bg-primary!"></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="bg-primary!"></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="bg-primary!"></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="bg-primary!"></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="bg-primary!"></div>
                        </div>
                    </Card>

                    {/* Feature 4: Verified Achievement (Shield visual) */}
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid"
                    >
                        <div className="space-y-2">
                            <h3 className="font-medium">Global Dev Community</h3>
                            <p className="text-muted-foreground text-sm">
                                Connect with a global network of ambitious learners and collaborate on meaningful challenges.
                            </p>
                        </div>

                        <div className="pointer-events-none relative -ml-7 flex size-44 items-center justify-center pt-5">
                            <Shield className="absolute inset-0 top-2.5 size-full stroke-[0.1px] opacity-15" />
                            <GraduationCap className="size-24 stroke-[1px] text-primary" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
