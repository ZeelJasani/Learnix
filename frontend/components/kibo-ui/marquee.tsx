"use client";

import FastMarquee from "react-fast-marquee";
import type { MarqueeProps as FastMarqueeProps } from "react-fast-marquee";
import { cn } from "@/lib/utils";
import * as React from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MarqueeRoot = React.forwardRef<HTMLDivElement, MarqueeProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
            {children}
        </div>
    )
);
MarqueeRoot.displayName = "Marquee";

interface MarqueeContentProps extends Omit<FastMarqueeProps, "children"> {
    children: React.ReactNode;
    direction?: "left" | "right";
}

function MarqueeContent({
    children,
    direction = "left",
    className,
    ...props
}: MarqueeContentProps) {
    return (
        <FastMarquee
            direction={direction}
            pauseOnHover
            autoFill
            className={cn("flex items-stretch", className)}
            {...props}
        >
            {children}
        </FastMarquee>
    );
}
MarqueeContent.displayName = "MarqueeContent";

interface MarqueeFadeProps extends React.HTMLAttributes<HTMLDivElement> {
    side: "left" | "right";
}

const MarqueeFade = React.forwardRef<HTMLDivElement, MarqueeFadeProps>(
    ({ side, className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "pointer-events-none absolute top-0 z-10 h-full w-16 md:w-24",
                side === "left"
                    ? "left-0 bg-gradient-to-r from-background to-transparent"
                    : "right-0 bg-gradient-to-l from-background to-transparent",
                className
            )}
            {...props}
        />
    )
);
MarqueeFade.displayName = "MarqueeFade";

interface MarqueeItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MarqueeItem = React.forwardRef<HTMLDivElement, MarqueeItemProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("mx-4 flex-shrink-0", className)} {...props}>
            {children}
        </div>
    )
);
MarqueeItem.displayName = "MarqueeItem";

export {
    MarqueeRoot as Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
};
