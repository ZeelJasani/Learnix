import { z } from 'zod';

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, 'Filename is required'),
    contentType: z.string().min(1, 'Content type is required'),
    size: z.number().min(1, 'Size is required'),
    isImage: z.boolean(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
