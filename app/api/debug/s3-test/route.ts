import { NextResponse } from "next/server";
import { S3, checkS3Connection, testS3Upload } from "@/lib/S3Client";

export async function GET() {
    try {
        // Check S3 connection
        const connection = await checkS3Connection();
        
        if (!connection.connected) {
            return NextResponse.json({
                success: false,
                message: "Failed to connect to S3",
                error: connection.error,
                details: connection.details
            }, { status: 500 });
        }

        // Test S3 upload with a small file
        const testFile = new Blob(["test content"], { type: 'text/plain' });
        const uploadTest = await testS3Upload(testFile, 'test-file.txt');

        return NextResponse.json({
            success: true,
            connection: {
                connected: true,
                region: process.env.AWS_REGION,
                bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            },
            uploadTest: {
                success: uploadTest.success,
                error: uploadTest.error,
                details: process.env.NODE_ENV === 'development' ? uploadTest.details : undefined
            }
        });
    } catch (error) {
        console.error('S3 Debug Error:', error);
        return NextResponse.json({
            success: false,
            message: "Error during S3 test",
            error: error instanceof Error ? error.message : 'Unknown error',
            details: process.env.NODE_ENV === 'development' ? {
                stack: error instanceof Error ? error.stack : undefined,
                env: {
                    nodeEnv: process.env.NODE_ENV,
                    region: process.env.AWS_REGION,
                    bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
                    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
                    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
                }
            } : undefined
        }, { status: 500 });
    }
}
