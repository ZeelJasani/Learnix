// "use client";

// import {
//     Marquee,
//     MarqueeContent,
//     MarqueeFade,
//     MarqueeItem,
// } from "@/components/kibo-ui/marquee";
// import {
//     Testimonial,
//     TestimonialAuthor,
//     TestimonialAuthorName,
//     TestimonialAuthorTagline,
//     TestimonialAvatar,
//     TestimonialAvatarImg,
//     TestimonialAvatarRing,
//     TestimonialQuote,
//     TestimonialVerifiedBadge,
// } from "@/components/ncdai/testimonials-marquee";

// type TestimonialData = {
//     authorAvatar: string;
//     authorName: string;
//     authorTagline: string;
//     quote: string;
//     verified?: boolean;
// };

// const TESTIMONIALS_1: TestimonialData[] = [
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
//         authorName: "Priya Sharma",
//         authorTagline: "Web Developer",
//         quote: "Learnix completely changed my career path. The web development course was so comprehensive that I landed my first developer job within 3 months! 🚀",
//         verified: true,
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
//         authorName: "Rahul Patel",
//         authorTagline: "Data Scientist",
//         quote: "The quality of instruction on Learnix is unmatched. The data science track gave me hands-on experience with real-world projects. Highly recommend! 📊",
//         verified: true,
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
//         authorName: "Ananya Gupta",
//         authorTagline: "UX Designer",
//         quote: "I loved the interactive learning experience. The instructors are incredibly supportive. Best investment in my education! ✨",
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
//         authorName: "Vikram Singh",
//         authorTagline: "Full Stack Developer",
//         quote: "From a complete beginner to a confident developer - that's my journey with Learnix. The curriculum is modern and practical. 💻",
//         verified: true,
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
//         authorName: "Sneha Reddy",
//         authorTagline: "Mobile App Developer",
//         quote: "I built and published my first app while still learning. The step-by-step approach makes complex topics easy to understand. 📱",
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
//         authorName: "Arjun Kumar",
//         authorTagline: "Cloud Engineer",
//         quote: "I went from knowing nothing about AWS to getting certified in just 2 months. The progress tracking kept me motivated. ☁️",
//         verified: true,
//     },
// ];

// const TESTIMONIALS_2: TestimonialData[] = [
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
//         authorName: "Meera Krishnan",
//         authorTagline: "Python Developer",
//         quote: "The Python course was exactly what I needed. Clear explanations, great projects, and an amazing community of learners. 🐍",
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
//         authorName: "Aditya Verma",
//         authorTagline: "ML Engineer",
//         quote: "Learnix made machine learning accessible. The practical exercises helped me understand complex algorithms with ease. 🤖",
//         verified: true,
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
//         authorName: "Kavya Nair",
//         authorTagline: "Frontend Developer",
//         quote: "The React course was phenomenal! I built 5 portfolio projects during the course. Now I'm working at my dream company. ⚛️",
//         verified: true,
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
//         authorName: "Rohan Mehta",
//         authorTagline: "DevOps Engineer",
//         quote: "The DevOps bootcamp was intense but worth it. Docker, Kubernetes, CI/CD - everything was covered beautifully. 🐳",
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
//         authorName: "Ishita Bansal",
//         authorTagline: "Product Designer",
//         quote: "Learnix helped me transition from graphic design to UX. The mentorship program was incredibly valuable. 🎨",
//     },
//     {
//         authorAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
//         authorName: "Siddharth Joshi",
//         authorTagline: "Blockchain Developer",
//         quote: "The blockchain course opened new career opportunities for me. The instructors are true industry experts. ⛓️",
//         verified: true,
//     },
// ];

// export default function Testimonials() {
//     return (
//         <section className="py-16 md:py-32">
//             <div className="mx-auto max-w-6xl px-6">
//                 <div className="text-center">
//                     <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">
//                         What Our Students Say
//                     </h2>
//                     <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
//                         Join thousands of successful learners who transformed their careers with Learnix.
//                     </p>
//                 </div>
//             </div>

//             <div className="mt-12 w-full space-y-4 bg-background [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
//                 {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
//                     <Marquee key={index} className="border-y border-border">
//                         <MarqueeFade side="left" />
//                         <MarqueeFade side="right" />

//                         <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
//                             {list.map((item, itemIndex) => (
//                                 <MarqueeItem
//                                     key={itemIndex}
//                                     className="mx-0 h-full w-80 border-r border-border"
//                                 >
//                                     <Testimonial>
//                                         <TestimonialQuote>
//                                             <p>{item.quote}</p>
//                                         </TestimonialQuote>

//                                         <TestimonialAuthor>
//                                             <TestimonialAvatar>
//                                                 <TestimonialAvatarImg
//                                                     src={item.authorAvatar}
//                                                     alt={item.authorName}
//                                                 />
//                                                 <TestimonialAvatarRing />
//                                             </TestimonialAvatar>

//                                             <div className="flex flex-col">
//                                                 <TestimonialAuthorName>
//                                                     {item.authorName}
//                                                     {item.verified && <TestimonialVerifiedBadge />}
//                                                 </TestimonialAuthorName>

//                                                 <TestimonialAuthorTagline>
//                                                     {item.authorTagline}
//                                                 </TestimonialAuthorTagline>
//                                             </div>
//                                         </TestimonialAuthor>
//                                     </Testimonial>
//                                 </MarqueeItem>
//                             ))}
//                         </MarqueeContent>
//                     </Marquee>
//                 ))}
//             </div>
//         </section>
//     );
// }







"use client";

import {
    Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
} from "@/components/kibo-ui/marquee";

import {
    Testimonial,
    TestimonialAuthor,
    TestimonialAuthorName,
    TestimonialAuthorTagline,
    TestimonialAvatar,
    TestimonialAvatarImg,
    TestimonialAvatarRing,
    TestimonialQuote,
} from "@/components/ncdai/testimonials-marquee";

import { TwitterVerifiedBadge } from "@/components/ui/TwitterVerifiedBadge";

type TestimonialData = {
    authorAvatar: string;
    authorName: string;
    authorTagline: string;
    quote: string;
    verified?: boolean;
};

const TESTIMONIALS_1: TestimonialData[] = [
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        authorName: "Priya Sharma",
        authorTagline: "Web Developer",
        quote:
            "Learnix completely changed my career path. The web development course was so comprehensive that I landed my first developer job within 3 months! 🚀",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        authorName: "Rahul Patel",
        authorTagline: "Data Scientist",
        quote:
            "The quality of instruction on Learnix is unmatched. The data science track gave me hands-on experience with real-world projects. Highly recommend! 📊",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        authorName: "Ananya Gupta",
        authorTagline: "UX Designer",
        quote:
            "I loved the interactive learning experience. The instructors are incredibly supportive. Best investment in my education! ✨",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        authorName: "Vikram Singh",
        authorTagline: "Full Stack Developer",
        quote:
            "From a complete beginner to a confident developer — that's my journey with Learnix. The curriculum is modern and practical. 💻",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
        authorName: "Sneha Reddy",
        authorTagline: "Mobile App Developer",
        quote:
            "I built and published my first app while still learning. The step-by-step approach makes complex topics easy to understand. 📱",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
        authorName: "Arjun Kumar",
        authorTagline: "Cloud Engineer",
        quote:
            "I went from knowing nothing about AWS to getting certified in just 2 months. The progress tracking kept me motivated. ☁️",
        verified: true,
    },
];

const TESTIMONIALS_2: TestimonialData[] = [
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
        authorName: "Meera Krishnan",
        authorTagline: "Python Developer",
        quote:
            "The Python course was exactly what I needed. Clear explanations, great projects, and an amazing community of learners. 🐍",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
        authorName: "Aditya Verma",
        authorTagline: "ML Engineer",
        quote:
            "Learnix made machine learning accessible. The practical exercises helped me understand complex algorithms with ease. 🤖",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
        authorName: "Kavya Nair",
        authorTagline: "Frontend Developer",
        quote:
            "The React course was phenomenal! I built 5 portfolio projects during the course. Now I'm working at my dream company. ⚛️",
        verified: true,
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
        authorName: "Rohan Mehta",
        authorTagline: "DevOps Engineer",
        quote:
            "The DevOps bootcamp was intense but worth it. Docker, Kubernetes, CI/CD — everything was covered beautifully. 🐳",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
        authorName: "Ishita Bansal",
        authorTagline: "Product Designer",
        quote:
            "Learnix helped me transition from graphic design to UX. The mentorship program was incredibly valuable. 🎨",
    },
    {
        authorAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
        authorName: "Siddharth Joshi",
        authorTagline: "Blockchain Developer",
        quote:
            "The blockchain course opened new career opportunities for me. The instructors are true industry experts. ⛓️",
        verified: true,
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                        What Our Students Say
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Join thousands of successful learners who transformed their careers with Learnix.
                    </p>
                </div>
            </div>

            <div className="mt-12 w-full space-y-6 bg-background [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
                {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
                    <Marquee key={index} className="border-y border-border">
                        <MarqueeFade side="left" />
                        <MarqueeFade side="right" />

                        <MarqueeContent direction={index % 2 ? "right" : "left"}>
                            {list.map((item, itemIndex) => (
                                <MarqueeItem
                                    key={itemIndex}
                                    className="mx-0 h-full w-80 border-r border-border"
                                >
                                    <Testimonial>
                                        <TestimonialQuote>
                                            <p>{item.quote}</p>
                                        </TestimonialQuote>

                                        <TestimonialAuthor>
                                            <TestimonialAvatar>
                                                <TestimonialAvatarImg
                                                    src={item.authorAvatar}
                                                    alt={item.authorName}
                                                />
                                                <TestimonialAvatarRing />
                                            </TestimonialAvatar>

                                            <div className="flex flex-col">
                                                <TestimonialAuthorName className="flex items-center gap-1">
                                                    {item.authorName}
                                                    {item.verified && <TwitterVerifiedBadge />}
                                                </TestimonialAuthorName>

                                                <TestimonialAuthorTagline>
                                                    {item.authorTagline}
                                                </TestimonialAuthorTagline>
                                            </div>
                                        </TestimonialAuthor>
                                    </Testimonial>
                                </MarqueeItem>
                            ))}
                        </MarqueeContent>
                    </Marquee>
                ))}
            </div>
        </section>
    );
}
