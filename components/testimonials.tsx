"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Testimonial = {
    name: string
    username: string
    image: string
    quote: string
    verified?: boolean
}

const testimonials: Testimonial[] = [
    {
        name: 'Priya Sharma',
        username: '@priyasharma_dev',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        quote: 'Learnix completely changed my career path. The web development course was so comprehensive that I landed my first developer job within 3 months! 🚀',
        verified: true,
    },
    {
        name: 'Rahul Patel',
        username: '@rahulpatel',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        quote: 'The quality of instruction on Learnix is unmatched. The data science track gave me hands-on experience with real-world projects. Highly recommend! 📊',
        verified: true,
    },
    {
        name: 'Ananya Gupta',
        username: '@ananya_ux',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        quote: 'I loved the interactive learning experience. The instructors are incredibly supportive. Best investment in my education! ✨',
        verified: false,
    },
    {
        name: 'Vikram Singh',
        username: '@vikram_codes',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        quote: 'From a complete beginner to a confident developer - thats my journey with Learnix. The curriculum is modern and practical. 💻',
        verified: true,
    },
    {
        name: 'Sneha Reddy',
        username: '@sneha_mobile',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        quote: 'I built and published my first app while still learning. The step-by-step approach makes complex topics easy to understand. 📱',
        verified: false,
    },
    {
        name: 'Arjun Kumar',
        username: '@arjun_cloud',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        quote: 'I went from knowing nothing about AWS to getting certified in just 2 months. The progress tracking kept me motivated. ☁️',
        verified: true,
    },
    {
        name: 'Meera Krishnan',
        username: '@meera_py',
        image: 'https://randomuser.me/api/portraits/women/7.jpg',
        quote: 'The Python course was exactly what I needed. Clear explanations, great projects, and an amazing community of learners. 🐍',
        verified: false,
    },
    {
        name: 'Aditya Verma',
        username: '@aditya_ml',
        image: 'https://randomuser.me/api/portraits/men/8.jpg',
        quote: 'Learnix made machine learning accessible. The practical exercises helped me understand complex algorithms with ease. 🤖',
        verified: true,
    },
    {
        name: 'Kavya Nair',
        username: '@kavya_frontend',
        image: 'https://randomuser.me/api/portraits/women/9.jpg',
        quote: 'The React course was phenomenal! I built 5 portfolio projects during the course. Now Im working at my dream company. ⚛️',
        verified: true,
    },
    {
        name: 'Rohan Mehta',
        username: '@rohan_devops',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
        quote: 'The DevOps bootcamp was intense but worth it. Docker, Kubernetes, CI/CD - everything was covered beautifully. 🐳',
        verified: false,
    },
    {
        name: 'Ishita Bansal',
        username: '@ishita_design',
        image: 'https://randomuser.me/api/portraits/women/11.jpg',
        quote: 'Learnix helped me transition from graphic design to UX. The mentorship program was incredibly valuable. 🎨',
        verified: false,
    },
    {
        name: 'Siddharth Joshi',
        username: '@sid_blockchain',
        image: 'https://randomuser.me/api/portraits/men/12.jpg',
        quote: 'The blockchain course opened new career opportunities for me. The instructors are true industry experts. ⛓️',
        verified: true,
    },
]

// Split testimonials into two rows
const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2))
const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2))

function TestimonialCard({ name, username, quote, image, verified }: Testimonial) {
    return (
        <div className="w-[320px] shrink-0 mx-2">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Header with profile */}
                <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                        <AvatarImage
                            alt={name}
                            src={image}
                            loading="lazy"
                        />
                        <AvatarFallback className="bg-blue-500 text-white font-medium text-sm">
                            {name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                                {name}
                            </span>
                            {verified && (
                                <svg className="size-4 shrink-0" viewBox="0 0 22 22" aria-label="Verified account">
                                    <circle cx="11" cy="11" r="11" fill="#1D9BF0" />
                                    <path d="M9.5 14.25L6.75 11.5L7.81 10.44L9.5 12.13L14.19 7.44L15.25 8.5L9.5 14.25Z" fill="white" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {username}
                        </span>
                    </div>
                </div>

                {/* Tweet/Review content */}
                <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {quote}
                </p>
            </div>
        </div>
    )
}

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">
                        What Our Students Say
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of successful learners who transformed their careers with Learnix.
                    </p>
                </div>
            </div>

            {/* First row - moves left */}
            <div className="mt-12 relative">
                <div className="flex animate-marquee hover:[animation-play-state:paused]">
                    {[...firstRow, ...firstRow].map((testimonial, index) => (
                        <TestimonialCard key={`first-${index}`} {...testimonial} />
                    ))}
                </div>
            </div>

            {/* Second row - moves right */}
            <div className="mt-4 relative">
                <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
                    {[...secondRow, ...secondRow].map((testimonial, index) => (
                        <TestimonialCard key={`second-${index}`} {...testimonial} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                @keyframes marquee-reverse {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
                .animate-marquee-reverse {
                    animation: marquee-reverse 35s linear infinite;
                }
            `}</style>
        </section>
    )
}
