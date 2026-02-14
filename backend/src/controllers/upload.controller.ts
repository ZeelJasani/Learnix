// ============================================================================
// Learnix LMS - Upload Controller (અપલોડ કંટ્રોલર)
// ============================================================================
// Aa controller file upload-related HTTP requests handle kare chhe.
// This controller handles file upload-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - S3 presigned URL generation (S3 presigned URL generate karvanu)
// - File deletion from storage (સ્ટોરેજ માંથી ફાઇલ ડિલીટ)
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * UploadController - અપલોડ સંબંધિત API endpoints
 * UploadController - Upload-related API endpoints
 *
 * Client-side direct upload mate presigned URLs provide kare chhe.
 * Provides presigned URLs for client-side direct uploads.
 */
export class UploadController {
    /**
     * S3 presigned upload URL generate karo / Get presigned URL for S3 upload
     *
     * fileName, contentType, size ane isImage accept kare chhe.
     * Accepts fileName, contentType, size and isImage flag.
     *
     * @route POST /api/uploads/presigned
     */
    static async getPresignedUrl(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Upload parameters kadho / Extract upload parameters
            const { fileName, contentType, size, isImage } = req.body;

            // Presigned URL generate karo / Generate presigned URL
            const result = await UploadService.getPresignedUploadUrl({
                fileName,
                contentType,
                size,
                isImage,
            });

            ApiResponse.success(res, {
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * S3 mathi file delete karo / Delete file from S3
     *
     * File key URL parameter ma ave chhe.
     * File key comes as URL parameter.
     *
     * @route DELETE /api/uploads/:key
     */
    static async deleteFile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { key } = req.params;

            // File delete karo / Delete the file
            await UploadService.deleteFile(key);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }
}
