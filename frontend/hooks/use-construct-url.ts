// ============================================================================
// Learnix LMS - Construct URL Hook (URL બનાવવા માટેનો હુક)
// ============================================================================
// Aa hook S3 storage key mathi public URL construct kare chhe.
// This hook constructs a public URL from an S3 storage key.
//
// File key ne full CDN URL ma convert kare chhe.
// Converts file key to full CDN URL.
// ============================================================================

import { env } from "@/lib/env";

// S3 key mathi public URL banavo / Build public URL from S3 key
export function useConstructUrl(key: string): string {
    if (!key) return '';
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storageapi.dev/${key}`;
}