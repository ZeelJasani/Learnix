/**
 * LoginForm Component — Deprecated sign-in wrapper (DEPRECATED)
 * LoginForm Component — Deprecated sign-in wrapper (DEPRECATED)
 *
 * Aa component deprecated chhe — Seedhi rite SignInForm use karo
 * This component is deprecated — Use SignInForm directly instead
 *
 * Backward compatibility mate rakhyu chhe — Juna imports ne todva nahi mate
 * Kept for backward compatibility — To avoid breaking old imports
 */
"use client";

import { SignInForm } from "./SignInForm";

/**
 * @deprecated Use SignInForm directly instead
 */
export function LoginForm() {
  return <SignInForm />;
}