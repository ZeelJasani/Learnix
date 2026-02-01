"use server";

import { api, getAuthToken } from "@/lib/api-client";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { requireUser } from "@/app/data/user/require-user";
import { User } from "@/lib/types/user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { headers } from "next/headers";

// Types
type ApiResponse = {
  status: 'success' | 'error';
  message: string;
  redirectUrl?: string;
  error?: string;
};

// Rate limiting configuration
const rateLimit = fixedWindow({
  mode: "LIVE",
  window: "1m",
  max: 5
});

const aj = arcjet.withRule(rateLimit);

// Constants
const MINIMUM_PRICE_INR = 50;

async function getBaseUrl(): Promise<string> {
  const fromEnv = env.APP_URL;
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      // fall through
    }
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) {
    throw new Error("APP_URL is not set and host header is missing");
  }
  return `${proto}://${host}`;
}

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
  try {
    // 1. Authentication and Rate Limiting
    const user = await requireUser() as User;

    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      throw new Error("You have been blocked due to too many requests. Please try again later.");
    }

    const token = await getAuthToken();
    if (!token) {
      return { status: 'error', message: 'Authentication required' };
    }

    // 2. Fetch Course Details from API
    const courseResponse = await api.get<{
      id: string;
      title: string;
      price: number;
      slug: string;
      stripePriceId: string;
    }>(`/courses/${courseId}`, token);

    if (!courseResponse.success || !courseResponse.data) {
      console.error('[Enrollment] Course not found:', courseId);
      return { status: 'error', message: 'Course not found' };
    }

    const course = courseResponse.data;

    // 3. Check if already enrolled
    const enrollmentCheck = await api.get<{ enrolled: boolean }>(`/enrollments/check/${courseId}`, token);
    if (enrollmentCheck.success && enrollmentCheck.data?.enrolled) {
      return { status: 'error', message: 'You are already enrolled in this course' };
    }

    // 4. Validate Course Price
    if (!course.stripePriceId) {
      return { status: 'error', message: 'Course is not properly configured for payments' };
    }

    try {
      const stripePrice = await stripe.prices.retrieve(course.stripePriceId);
      const priceInSmallestUnit = stripePrice.unit_amount || 0;
      const priceInRupees = priceInSmallestUnit / 100;

      if (priceInRupees < MINIMUM_PRICE_INR) {
        return {
          status: 'error',
          message: `Course price must be at least ₹${MINIMUM_PRICE_INR}`
        };
      }
    } catch (error) {
      console.error('[Enrollment] Error validating course price:', error);
      return {
        status: 'error',
        message: 'Failed to validate course price. Please try again.'
      };
    }

    // 5. Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || '',
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;

      // Update user's stripeCustomerId via API (would need backend endpoint)
      // For now, we'll proceed with the new customer ID
    }

    // 6. Create pending enrollment via API
    const enrollmentResponse = await api.post<{ id: string }>('/enrollments', {
      courseId,
      amount: course.price,
    }, token);

    const enrollmentId = enrollmentResponse.data?.id;

    // 7. Create Checkout Session
    const baseUrl = await getBaseUrl();
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: course.stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      metadata: {
        userId: user.id,
        courseId,
        enrollmentId: enrollmentId || '',
        coursePrice: course.price.toString(),
      },
    });

    if (!checkoutSession.url) {
      return {
        status: 'error',
        message: 'Failed to create payment session. Please try again.',
      };
    }

    // 8. Return Success with Redirect URL
    return {
      status: 'success',
      message: 'Redirecting to payment...',
      redirectUrl: checkoutSession.url
    };

  } catch (error) {
    console.error('[Enrollment Error]', error);

    if (error instanceof Error) {
      return { status: 'error', message: error.message, error: error.message };
    }

    return { status: 'error', message: 'An unknown error occurred. Please try again.' };
  }
}
