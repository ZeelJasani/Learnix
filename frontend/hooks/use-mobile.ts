// ============================================================================
// Learnix LMS - Mobile Detection Hook (મોબાઇલ ડિટેક્શન હુક)
// ============================================================================
// Aa hook responsive design mate mobile device detect kare chhe.
// This hook detects mobile devices for responsive design.
//
// 768px breakpoint use kare chhe (Tailwind md breakpoint sathe match thay chhe).
// Uses 768px breakpoint (matches Tailwind's md breakpoint).
// ============================================================================

import * as React from "react"

// Mobile breakpoint - 768px (md breakpoint)
const MOBILE_BREAKPOINT = 768

// Mobile device detect karo / Detect if on mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query listener set karo / Set up media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Initial value set karo / Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Cleanup: listener remove karo / Cleanup: remove listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
