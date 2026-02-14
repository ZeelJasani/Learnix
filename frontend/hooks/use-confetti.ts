// ============================================================================
// Learnix LMS - Confetti Hook (કોન્ફેટી હુક)
// ============================================================================
// Aa hook celebration confetti animation trigger kare chhe.
// This hook triggers celebration confetti animation.
//
// Course complete, quiz pass, achievement unlock jeva events mate use thay chhe.
// Used for events like course completion, quiz pass, achievement unlock.
// ============================================================================

"use client";

import confetti from 'canvas-confetti'

// Confetti hook - celebration animation mate / Confetti hook - for celebration animation
export const useConfetti = () => {
    // Confetti trigger karo alag alag particle patterns sathe
    // Trigger confetti with different particle patterns
    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        // Particle burst fire karo custom settings sathe
        // Fire particle burst with custom settings
        function fire(particleRatio: number, opts: Record<string, unknown>) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        // Multiple bursts alag alag spread ane velocity sathe
        // Multiple bursts with different spread and velocity
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    return { triggerConfetti };
}