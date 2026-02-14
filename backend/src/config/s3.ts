/**
 * S3/Cloudflare R2 Storage Configuration / S3/Cloudflare R2 Storage Configuration
 *
 * Aa file AWS S3-compatible storage client configure kare chhe.
 * This file configures the AWS S3-compatible storage client.
 *
 * Cloudflare R2 sathe compatible chhe je S3 API ne support kare chhe.
 * Compatible with Cloudflare R2 which supports the S3 API.
 *
 * Usage / Usage:
 * - Course materials upload
 * - Assignment submissions
 * - Profile images
 */
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { env } from './env';
import { logger } from '../utils/logger';

// S3 client configuration
// Region, endpoint, ane credentials set karo
// Set region, endpoint, and credentials
const s3Config = {
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,        // Custom endpoint (R2 mate)
    forcePathStyle: true,                      // Path-style URLs use karo
    maxAttempts: 3,                            // Retry 3 var fail thay to
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
};

// S3 client instance export karo
// Export S3 client instance
export const s3Client = new S3Client(s3Config);

/**
 * S3 connection check karo
 * Check S3 connection
 *
 * Server startup par call kari shakay chhe connection verify karvaa mate.
 * Can be called on server startup to verify the connection.
 *
 * @returns Connection status with optional error message
 */
export const checkS3Connection = async (): Promise<{ connected: boolean; error?: string }> => {
    try {
        // ListBuckets command moki ne connection test karo
        // Test connection by sending ListBuckets command
        await s3Client.send(new ListBucketsCommand({}));
        logger.info('✅ S3 connection verified');
        return { connected: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('❌ S3 connection failed:', errorMessage);
        return { connected: false, error: errorMessage };
    }
};

/**
 * S3 bucket name return kare chhe
 * Returns S3 bucket name
 */
export const getBucketName = (): string => env.S3_BUCKET_NAME;
