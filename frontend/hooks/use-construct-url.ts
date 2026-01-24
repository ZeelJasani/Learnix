import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
    if (!key) return '';
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storageapi.dev/${key}`;
}