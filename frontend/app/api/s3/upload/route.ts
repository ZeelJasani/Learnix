import { env } from "@/lib/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "Filename is required" }),
    contentType: z.string().min(1, { message: "Content type is required" }),
    size: z.number().min(1, { message: "Size is required" }),
    isImage: z.boolean(),
});




const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);



export async function POST(request: Request) {
    const session = await requireAdmin();
    
    try {
        // Add rate limiting protection
        const decision = await aj.protect(request, {
            fingerprint: session?.user.id
        });

        if (decision.isDenied()) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            console.error('Invalid JSON in request body:', error);
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        const validation = fileUploadSchema.safeParse(body);
        if (!validation.success) {
            console.error('Validation error:', validation.error);
            return NextResponse.json(
                { 
                    error: "Invalid request body",
                    details: process.env.NODE_ENV === 'development' 
                        ? validation.error.format() 
                        : undefined 
                },
                { status: 400 }
            );
        }

        const { fileName, contentType, size } = validation.data;
        
        // Validate file size (max 10MB for images, 100MB for videos)
        const maxSize = contentType.startsWith('image/') ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
        if (size > maxSize) {
            return NextResponse.json(
                { error: `File size too large. Maximum allowed: ${maxSize / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        // Generate a unique key with proper file extension
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const uniqueKey = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;

        try {
            // Generate a pre-signed URL for direct upload to S3
            const command = new PutObjectCommand({
                Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
                ContentType: contentType,
                ContentLength: size,
                Key: uniqueKey,
                ACL: 'public-read',
                CacheControl: 'public, max-age=31536000, immutable',
            });

            // Generate pre-signed URL with extended expiration
            const presignedUrl = await getSignedUrl(S3, command, {
                expiresIn: 3600, // 1 hour
            });

            return NextResponse.json({
                success: true,
                presignedUrl,
                key: uniqueKey,
                bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
                region: env.AWS_REGION,
                contentType
            });
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            return NextResponse.json(
                { 
                    error: "Failed to generate upload URL",
                    details: process.env.NODE_ENV === 'development' 
                        ? error instanceof Error ? error.message : String(error)
                        : undefined
                },
                { status: 500 }
            );
        }
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}