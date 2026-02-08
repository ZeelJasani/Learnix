"use server";

import { requireAdminOrMentor } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { api, getAuthToken } from "@/lib/api-client";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

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


export async function CreateCourse(courseInput: CourseSchemaType): Promise<ApiResponse> {

    const session = await requireAdminOrMentor(true);
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting",
                };
            }
            else {
                return {
                    status: "error",
                    message: "You are a bot! If this is a mistake contact our support",
                };
            }
        }

        const validation = courseSchema.safeParse(courseInput);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }



        // Get auth token for API call
        const token = await getAuthToken();

        if (!token) {
            return {
                status: "error",
                message: "Authentication required",
            };
        }

        // Create course via API
        const response = await api.post('/admin/courses', {
            ...validation.data,
            ...validation.data,
            // Stripe creation is handled by the backend service
        }, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to create course",
            };
        }

        return {
            status: "success",
            message: "Course created successfully",
        };

    } catch (error) {
        console.error("Error creating course:", error);
        return {
            status: 'error',
            message: 'Failed to create course'
        }
    }
} 