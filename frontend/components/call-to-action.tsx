// Aa component landing page nu "Start Learning Today" CTA section render kare chhe
// This component renders the call-to-action section with registration and course browsing buttons
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">Start Learning Today</h2>
                    <p className="mt-4 text-muted-foreground">Join thousands of learners and unlock your potential with Learnix.</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg">
                            <Link href="/register">
                                <span>Get Started Free</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link href="/courses">
                                <span>Browse Courses</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
