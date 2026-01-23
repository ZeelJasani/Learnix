import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";

export default function AboutPage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight mb-8">About Learnix</h1>

                    <div className="space-y-6 text-muted-foreground">
                        <p className="text-lg">
                            Learnix is a modern learning platform designed to help you master new skills
                            through practical, project-based courses.
                        </p>

                        <p>
                            We believe learning should be accessible, engaging, and directly applicable
                            to real-world challenges. Our courses are crafted by industry professionals
                            who understand what it takes to succeed.
                        </p>

                        <p>
                            Whether you're starting your journey or advancing your career, Learnix
                            provides the tools and community to help you grow.
                        </p>
                    </div>

                    {/* <div className="mt-12 pt-8 border-t">
                        <h2 className="text-xl font-semibold mb-4">Get Started</h2>
                        <div className="flex gap-4">
                            <a
                                href="/courses"
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Browse Courses
                            </a>
                            <a
                                href="/sign-up"
                                className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div> */}
                </div>
            </main>
            <FooterSection />
        </>
    );
}
