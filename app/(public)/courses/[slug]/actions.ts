"use server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { requireUser } from "@/app/data/user/require-user";
import { User } from "@/lib/types/user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

// Types
type ApiResponse = {
  status: 'success' | 'error';
  message: string;
  redirectUrl?: string;
  error?: string;
};

type TransactionResult = {
  success: boolean;
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
const MINIMUM_PRICE_INR = 50; // Stripe's minimum is 50 cents, which is ~₹50
const TRANSACTION_TIMEOUT = 30000; // 30 seconds

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
  try {
    // 1. Authentication and Rate Limiting
    const user = await requireUser() as User;
    
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });
    
    if (decision.isDenied()) {
      throw new Error("You have been blocked due to too many requests. Please try again later.");
    }

    // 2. Fetch Course Details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, slug: true, stripePriceId: true }
    });

    if (!course) {
      console.error('[Enrollment] Course not found:', courseId);
      return { status: 'error', message: 'Course not found' };
    }

    // 3. Process Transaction
    const transactionResult = await processEnrollmentTransaction(user.id, courseId);
    
    if (!transactionResult.success) {
      return {
        status: 'error',
        message: transactionResult.error || 'Failed to process enrollment',
        error: transactionResult.error
      };
    }

    if (!transactionResult.redirectUrl) {
      return {
        status: 'error',
        message: 'Failed to generate checkout URL',
        error: 'Missing redirect URL'
      };
    }

    // 4. Return Success with Redirect URL
    return {
      status: 'success',
      message: 'Redirecting to payment...',
      redirectUrl: transactionResult.redirectUrl
    };

  } catch (error) {
    console.error('[Enrollment Error]', error);
    
    const errorMessage = getErrorMessage(error);
    return { status: 'error', message: errorMessage, error: errorMessage };
  }
}

// Helper Functions
async function processEnrollmentTransaction(userId: string, courseId: string): Promise<TransactionResult> {
  return await prisma.$transaction(async (tx) => {
    // 1. Handle Stripe Customer
    const customerId = await getOrCreateStripeCustomer(tx, userId);
    
    // 2. Get Fresh Course Data
    const course = await tx.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, stripePriceId: true }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // 3. Validate Course Price
    const priceValidation = await validateCoursePrice(course.stripePriceId);
    if (!priceValidation.isValid) {
      throw new Error(priceValidation.error || 'Invalid course price');
    }

    // 4. Handle Enrollment
    const enrollment = await handleEnrollment(tx, userId, courseId, course.price);

    // 5. Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: course.stripePriceId!, quantity: 1 }],
      mode: 'payment',
      success_url: `${env.BETTER_AUTH_URL}/payment/success`,
      cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      metadata: {
        userId,
        courseId,
        enrollmentId: enrollment.id,
        coursePrice: course.price.toString(),
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create payment session. Please try again.');
    }

    return { success: true, redirectUrl: checkoutSession.url };
  }, { timeout: TRANSACTION_TIMEOUT });
}

async function getOrCreateStripeCustomer(
  tx: any,
  userId: string
): Promise<string> {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || '',
    metadata: { userId },
  });

  await tx.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

async function validateCoursePrice(stripePriceId: string | null): Promise<{ isValid: boolean; error?: string }> {
  if (!stripePriceId) {
    return { isValid: false, error: 'Course is not properly configured for payments' };
  }

  try {
    const stripePrice = await stripe.prices.retrieve(stripePriceId);
    const priceInSmallestUnit = stripePrice.unit_amount || 0;
    const currency = (stripePrice.currency || 'inr').toLowerCase();
    const priceInRupees = priceInSmallestUnit / 100;

    if (priceInRupees < MINIMUM_PRICE_INR) {
      console.error(`[Enrollment] Stripe price (${currency.toUpperCase()} ${priceInRupees}) is below minimum (₹${MINIMUM_PRICE_INR})`);
      return { 
        isValid: false, 
        error: `Course price must be at least ₹${MINIMUM_PRICE_INR}` 
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('[Enrollment] Error validating course price:', error);
    return { 
      isValid: false, 
      error: 'Failed to validate course price. Please try again.' 
    };
  }
}

async function handleEnrollment(
  tx: any,
  userId: string,
  courseId: string,
  price: number
) {
  // Check for existing enrollment
  const existingEnrollment = await tx.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true, id: true }
  });

  if (existingEnrollment?.status === 'Active') {
    throw new Error('You are already enrolled in this course');
  }

  // Create or update enrollment
  return existingEnrollment
    ? await tx.enrollment.update({
        where: { id: existingEnrollment.id },
        data: { amount: price, status: 'Pending', updatedAt: new Date() },
      })
    : await tx.enrollment.create({
        data: { userId, courseId, amount: price, status: 'Pending' },
      });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    if (message.includes('blocked') || message.includes('too many requests')) {
      return message;
    } else if (message.includes('Course not found')) {
      return 'The requested course could not be found.';
    } else if (message.includes('already enrolled')) {
      return 'You are already enrolled in this course.';
    } else if (message.includes('checkout session') || message.includes('payment')) {
      return 'There was an issue processing your payment. Please try again.';
    }

    // Handle Stripe-specific errors
    if ('code' in error) {
      const stripeError = error as { code?: string; type?: string };
      if (stripeError.code === 'resource_missing') {
        return 'Payment configuration is incomplete. Please contact support.';
      } else if (stripeError.type === 'StripeCardError') {
        return 'Your card was declined. Please try a different payment method.';
      } else if (stripeError.code === 'api_key_expired') {
        return 'Payment service configuration error. Please contact support.';
      }
    }

    return message;
  }
  
  return 'An unknown error occurred. Please try again.';
}
