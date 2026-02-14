/**
 * Upload Service / Upload Service
 *
 * Aa service S3-compatible storage (AWS S3 / Cloudflare R2) mate file upload ane delete handle kare chhe.
 * This service handles file upload and delete for S3-compatible storage (AWS S3 / Cloudflare R2).
 *
 * Features / Features:
 * - Presigned URL generation: Client-side direct upload mate secure URL
 * - Size validation: Image 10MB, Video 100MB limit
 * - Unique key generation: UUID-based file keys collision prevent kare
 * - File deletion: S3 bucket thi file remove karvo
 * - URL generation: File key thi public URL generate karvo
 */
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
    // Maximum file size limits / Maximum file size limits
    private static readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB - Image limit
    private static readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB - Video limit
    private static readonly URL_EXPIRY = 3600; // 1 hour - Presigned URL expiry

    /**
     * Client-side direct upload mate presigned URL generate karo
     * Generate a presigned URL for client-side direct S3 upload
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
     * S3 bucket ma thi file delete karo / Delete a file from S3 bucket
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
     * File key thi public URL generate karo / Get public URL from file key
     */
    static getFileUrl(key: string): string {
        if (!key) return '';

        // This assumes the bucket is publicly accessible
        // Adjust based on your S3/R2 configuration
        const bucket = getBucketName();
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
}
