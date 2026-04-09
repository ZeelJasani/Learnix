"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TwitterVerifiedBadge } from "@/components/ui/TwitterVerifiedBadge";

type Testimonial = {
    authorAvatar: string;
    authorName: string;
    authorTagline: string;
    quote: string;
    verified?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        authorName: "Priya Sharma",
        authorTagline: "Web Developer",
        quote: "Learnix completely changed my career path. The web development course was so comprehensive that I landed my first developer job within 3 months.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        authorName: "Rahul Patel",
        authorTagline: "Data Scientist",
        quote: "The quality of instruction on Learnix is unmatched. The data science track gave me hands-on experience with real-world projects. Highly recommend.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        authorName: "Ananya Gupta",
        authorTagline: "UX Designer",
        quote: "I loved the interactive learning experience. The instructors are incredibly supportive. Best investment in my education.",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        authorName: "Vikram Singh",
        authorTagline: "Full Stack Developer",
        quote: "From a complete beginner to a confident developer, that's my journey with Learnix. The curriculum is modern and practical.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
        authorName: "Sneha Reddy",
        authorTagline: "Mobile App Developer",
        quote: "I built and published my first app while still learning. The step-by-step approach makes complex topics easy to understand.",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
        authorName: "Arjun Kumar",
        authorTagline: "Cloud Engineer",
        quote: "I went from knowing nothing about AWS to getting certified in just 2 months. The progress tracking kept me motivated.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
        authorName: "Meera Krishnan",
        authorTagline: "Python Developer",
        quote: "The Python course was exactly what I needed. Clear explanations, great projects, and an amazing community of learners.",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
        authorName: "Aditya Verma",
        authorTagline: "ML Engineer",
        quote: "Learnix made machine learning accessible. The practical exercises helped me understand complex algorithms with ease.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
        authorName: "Kavya Nair",
        authorTagline: "Frontend Developer",
        quote: "The React course was phenomenal. I built 5 portfolio projects during the course. Now I'm working at my dream company.",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
        authorName: "Rohan Mehta",
        authorTagline: "DevOps Engineer",
        quote: "The DevOps bootcamp was intense but worth it. Docker, Kubernetes, and CI/CD were covered beautifully.",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
        authorName: "Ishita Bansal",
        authorTagline: "Product Designer",
        quote: "Learnix helped me transition from graphic design to UX. The mentorship program was incredibly valuable.",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
        authorName: "Siddharth Joshi",
        authorTagline: "Blockchain Developer",
        quote: "The blockchain course opened new career opportunities for me. The instructors are true industry experts.",
        verified: true,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const activeTestimonial = TESTIMONIALS[currentIndex];

    return (
        <section className="bg-background py-20 md:py-24">
            <div className="mx-auto max-w-3xl px-6">
                <header className="mb-12 text-center">
                    <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        What Our Students Say
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                        Join thousands of successful learners who transformed their careers with Learnix.
                    </p>
                </header>

                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-foreground/10 bg-muted/30 p-6 md:p-10">
                        <div className="absolute inset-y-0 left-0 w-1 bg-primary/80"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="min-h-[100px]"
                            >
                                <blockquote className="text-balance text-lg font-medium leading-relaxed text-foreground md:text-xl">
                                    "{activeTestimonial.quote}"
                                </blockquote>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex w-full max-w-xl items-center gap-4 px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 p-1 md:size-20"
                            >
                                <Image
                                    src={activeTestimonial.authorAvatar}
                                    alt={activeTestimonial.authorName}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col"
                            >
                                <cite className="flex items-center gap-1.5 text-lg font-bold not-italic leading-snug text-foreground md:text-xl">
                                    {activeTestimonial.authorName}
                                    {activeTestimonial.verified && (
                                        <TwitterVerifiedBadge className="mt-0.5" />
                                    )}
                                </cite>
                                <span className="text-sm font-medium text-muted-foreground md:text-base">
                                    {activeTestimonial.authorTagline}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2.5">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "w-8 bg-primary"
                                        : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                                }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
