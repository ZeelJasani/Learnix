// ============================================================================
// Learnix LMS - S3 Client (S3 ક્લાયન્ટ)
// ============================================================================
// Aa file AWS S3-compatible storage client configure kare chhe.
// This file configures the AWS S3-compatible storage client.
//
// Features / વિશેષતાઓ:
// - S3 client singleton instance (auto-retry sathe)
// - Build-time mock client (AWS credentials vagar safe build)
// - Connection health check function
// - Test file upload utility
//
// ⚠️ Server-only: Aa module faqat server-side code ma use thay chhe
// ⚠️ Server-only: This module is only used in server-side code
// ============================================================================

import "server-only";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const env = process.env;

/**
 * S3 client create karo / Create S3 client
 *
 * AWS credentials na hoy to mock client return kare chhe (build-time safety).
 * Returns mock client if AWS credentials are missing (build-time safety).
 */
function createS3Client() {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
        // Build-time mock client - credentials vagar safely build thay
        // Build-time mock client - builds safely without credentials
        return new Proxy({} as S3Client, {
            get() {
                throw new Error('AWS credentials are not properly configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
            }
        });
    }

    // S3-compatible storage configuration (Cloudflare R2, MinIO, etc.)
    const s3Config = {
        region: env.AWS_REGION || "auto",
        endpoint: env.AWS_ENDPOINT_URL_S3,
        forcePathStyle: true, // S3-compatible storage mate required chhe / Required for S3-compatible storage
        maxAttempts: 3,
        retryMode: "standard" as const,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        // Upload timeout 60 seconds / Upload timeout 60 seconds
        requestHandler: {
            requestTimeout: 60000,
        },
        customUserAgent: `mastrji-app/${env.NODE_ENV || 'development'}`,
        // Development ma SSL disable karo / Disable SSL in development
        ...(env.NODE_ENV === 'development' && {
            sslEnabled: false,
        }),
    };

    return new S3Client(s3Config);
}

// S3 client singleton instance
// Enhanced S3 client configuration for both development and production
export const S3 = createS3Client();

/**
 * S3 connection check karo / Check S3 connectivity
 *
 * ListBuckets command thi connection verify kare chhe.
 * Verifies connection using ListBuckets command.
 */
export async function checkS3Connection() {
    try {
        await S3.send(new ListBucketsCommand({}));
        return { connected: true };
    } catch (error) {
        console.error('S3 Connection Error:', error);
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            // Development ma extra debug info return karo / Return extra debug info in development
            details: env.NODE_ENV === 'development' ?
                {
                    region: env.AWS_REGION,
                    endpoint: env.AWS_ENDPOINT_URL_S3,
                    nodeEnv: env.NODE_ENV
                } : undefined
        };
    }
}

/**
 * Test file upload karo / Test file upload
 *
 * S3 upload functionality verify karva mate test helper.
 * Test helper to verify S3 upload functionality.
 */
export async function testS3Upload(file: Blob, key: string) {
    try {
        const { PutObjectCommand } = await import('@aws-sdk/client-s3');
        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: `test-${Date.now()}-${key}`,
            Body: file,
            ContentType: file.type,
        });

        const result = await S3.send(command);
        return { success: true, result };
    } catch (error) {
        console.error('S3 Upload Test Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: env.NODE_ENV === 'development' ? error : undefined
        };
    }
}