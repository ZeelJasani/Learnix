import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, getBucketName } from '../config/s3';
import { ApiError } from '../utils/apiError';

interface UploadRequest {
    fileName: string;
    contentType: string;
    size: number;
    isImage: boolean;
}

interface PresignedUrlResponse {
    presignedUrl: string;
    key: string;
    bucket: string;
    contentType: string;
}

export class UploadService {
    private static readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    private static readonly URL_EXPIRY = 3600; // 1 hour

    /**
     * Generate a presigned URL for direct S3 upload
     */
    static async getPresignedUploadUrl(data: UploadRequest): Promise<PresignedUrlResponse> {
        // Validate file size
        const maxSize = data.isImage ? this.MAX_IMAGE_SIZE : this.MAX_VIDEO_SIZE;
        if (data.size > maxSize) {
            throw ApiError.badRequest(
                `File size too large. Maximum allowed: ${maxSize / (1024 * 1024)}MB`
            );
        }

        // Generate unique key
        const fileExtension = data.fileName.split('.').pop()?.toLowerCase() || '';
        const uniqueKey = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
        const bucket = getBucketName();

        try {
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: uniqueKey,
                ContentType: data.contentType,
                ContentLength: data.size,
                ACL: 'public-read',
                CacheControl: 'public, max-age=31536000, immutable',
            });

            const presignedUrl = await getSignedUrl(s3Client, command, {
                expiresIn: this.URL_EXPIRY,
            });

            return {
                presignedUrl,
                key: uniqueKey,
                bucket,
                contentType: data.contentType,
            };
        } catch (error) {
            throw ApiError.internal('Failed to generate upload URL');
        }
    }

    /**
     * Delete a file from S3
     */
    static async deleteFile(key: string): Promise<boolean> {
        if (!key) {
            throw ApiError.badRequest('File key is required');
        }

        try {
            const command = new DeleteObjectCommand({
                Bucket: getBucketName(),
                Key: key,
            });

            await s3Client.send(command);
            return true;
        } catch (error) {
            throw ApiError.internal('Failed to delete file');
        }
    }

    /**
     * Get file URL from key
     */
    static getFileUrl(key: string): string {
        if (!key) return '';

        // This assumes the bucket is publicly accessible
        // Adjust based on your S3/R2 configuration
        const bucket = getBucketName();
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
}
