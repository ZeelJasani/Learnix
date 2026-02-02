import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { env } from './env';
import { logger } from '../utils/logger';

const s3Config = {
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    maxAttempts: 3,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
};

export const s3Client = new S3Client(s3Config);

export const checkS3Connection = async (): Promise<{ connected: boolean; error?: string }> => {
    try {
        await s3Client.send(new ListBucketsCommand({}));
        logger.info('S3 connection verified');
        return { connected: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('S3 connection failed:', errorMessage);
        return { connected: false, error: errorMessage };
    }
};

export const getBucketName = (): string => env.S3_BUCKET_NAME;
