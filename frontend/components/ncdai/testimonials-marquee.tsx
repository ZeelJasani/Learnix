"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Main Testimonial Container
const Testimonial = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full flex-col justify-between gap-4 p-6 bg-card transition-colors",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
Testimonial.displayName = "Testimonial";

// Quote Section
const TestimonialQuote = React.forwardRef<
    HTMLBlockquoteElement,
    React.HTMLAttributes<HTMLBlockquoteElement>
>(({ className, children, ...props }, ref) => (
    <blockquote
        ref={ref}
        className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            className
        )}
        {...props}
    >
        {children}
    </blockquote>
));
TestimonialQuote.displayName = "TestimonialQuote";

// Author Section
const TestimonialAuthor = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center gap-3", className)}
        {...props}
    >
        {children}
    </div>
));
TestimonialAuthor.displayName = "TestimonialAuthor";

// Author Avatar Container
const TestimonialAvatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
    </div>
));
TestimonialAvatar.displayName = "TestimonialAvatar";

// Avatar Image
interface TestimonialAvatarImgProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
}

const TestimonialAvatarImg = React.forwardRef<
    HTMLDivElement,
    TestimonialAvatarImgProps
>(({ src, alt = "Avatar", className, ...props }, ref) => (
    <Avatar ref={ref} className={cn("size-10", className)} {...props}>
        <AvatarImage src={src} alt={alt} loading="lazy" />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {alt?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
    </Avatar>
));
TestimonialAvatarImg.displayName = "TestimonialAvatarImg";

// Avatar Ring (decorative)
const TestimonialAvatarRing = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "absolute inset-0 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
            className
        )}
        {...props}
    />
));
TestimonialAvatarRing.displayName = "TestimonialAvatarRing";

// Author Name
const TestimonialAuthorName = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center gap-1.5 font-semibold text-sm text-foreground",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
TestimonialAuthorName.displayName = "TestimonialAuthorName";

// Author Tagline
const TestimonialAuthorTagline = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
    >
        {children}
    </span>
));
TestimonialAuthorTagline.displayName = "TestimonialAuthorTagline";

// Verified Badge
const TestimonialVerifiedBadge = React.forwardRef<
    SVGSVGElement,
    React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        className={cn("size-4 shrink-0", className)}
        viewBox="0 0 22 22"
        aria-label="Verified account"
        {...props}
    >
        <circle cx="11" cy="11" r="11" fill="#1D9BF0" />
        <path
            d="M9.5 14.25L6.75 11.5L7.81 10.44L9.5 12.13L14.19 7.44L15.25 8.5L9.5 14.25Z"
            fill="white"
        />
    </svg>
));
TestimonialVerifiedBadge.displayName = "TestimonialVerifiedBadge";

export {
    Testimonial,
    TestimonialQuote,
    TestimonialAuthor,
    TestimonialAvatar,
    TestimonialAvatarImg,
    TestimonialAvatarRing,
    TestimonialAuthorName,
    TestimonialAuthorTagline,
    TestimonialVerifiedBadge,
};
