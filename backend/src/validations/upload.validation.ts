// ============================================================================
// Learnix LMS - Upload Validation Schema (અપલોડ વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file file upload request validate karvani Zod schema define kare chhe.
// This file defines a Zod schema for validating file upload requests.
//
// Schema:
// - fileUploadSchema → S3 presigned URL request validate karva mate
//                      For validating S3 presigned URL requests
// ============================================================================

import { z } from 'zod';

// File upload request validation - fileName, contentType, size, ane isImage jaruri
// File upload request validation - fileName, contentType, size, and isImage required
export const fileUploadSchema = z.object({
    fileName: z.string().min(1, 'Filename is required'),
    contentType: z.string().min(1, 'Content type is required'),
    size: z.number().min(1, 'Size is required'),
    isImage: z.boolean(),
});

// TypeScript type export - schema thi infer thayelo type
// TypeScript type export - type inferred from schema
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
