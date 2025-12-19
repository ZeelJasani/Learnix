import "server-only";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const env = process.env;

if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials are not properly configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
}

const s3Config = {
    region: env.AWS_REGION || "auto",
    endpoint: env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true, // Required for S3-compatible storage
    maxAttempts: 3,
    retryMode: "standard" as const,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    },
    // S3 specific settings
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    // Request handler configuration
    requestHandler: {
        requestTimeout: 60000, // 60 seconds for uploads
    },
    // Custom user agent
    customUserAgent: `mastrji-app/${env.NODE_ENV || 'development'}`,
    // CORS settings
    ...(env.NODE_ENV === 'development' && {
        sslEnabled: false,
    }),
};

// Enhanced S3 client configuration for both development and production
export const S3 = new S3Client(s3Config);

// Add a function to check S3 connectivity
export async function checkS3Connection() {
    try {
        await S3.send(new ListBucketsCommand({}));
        return { connected: true };
    } catch (error) {
        console.error('S3 Connection Error:', error);
        return { 
            connected: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            details: env.NODE_ENV === 'development' ? 
                { 
                    region: env.AWS_REGION,
                    endpoint: env.AWS_ENDPOINT_URL_S3,
                    nodeEnv: env.NODE_ENV
                } : undefined
        };
    }
}

// Add a function to test file upload
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
        console.error('S3 Upload Test Error:',   error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            details: env.NODE_ENV === 'development' ? error : undefined
        };
    }
}