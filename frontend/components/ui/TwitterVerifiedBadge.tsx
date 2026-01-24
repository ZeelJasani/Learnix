"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TwitterVerifiedBadge = React.forwardRef<
    SVGSVGElement,
    React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        className={cn("size-4 shrink-0", className)}
        viewBox="0 0 24 24"
        aria-label="Verified account"
        fill="none"
        {...props}
    >
        {/* Scalloped/flower-shaped badge */}
        <path
            d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
            fill="#1D9BF0"
        />
        {/* White checkmark */}
        <path
            d="M9.5 12.5l2 2 4-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
));
TwitterVerifiedBadge.displayName = "TwitterVerifiedBadge";

export { TwitterVerifiedBadge };
