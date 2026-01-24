import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/apiResponse';

export class UploadController {
    /**
     * Get presigned URL for S3 upload
     */
    static async getPresignedUrl(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fileName, contentType, size, isImage } = req.body;

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
     * Delete file from S3
     */
    static async deleteFile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { key } = req.params;

            await UploadService.deleteFile(key);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }
}
