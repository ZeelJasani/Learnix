// /* eslint-disable @typescript-eslint/no-unused-vars */
// // import { auth } from "@lib/auth";

// import ip from "@arcjet/ip";
// import arcjet, {
//   type ArcjetDecision,
//   type BotOptions,
//   type EmailOptions,
//   type ProtectSignupOptions,
//   type SlidingWindowRateLimitOptions,
//   detectBot,
//   protectSignup,
//   shield,
//   slidingWindow,
// } from "@arcjet/next";
// import { toNextJsHandler } from "better-auth/next-js";
// import { NextRequest } from "next/server";
// import { auth } from "@/lib/auth";





// const emailOptions = {
//   mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//   // Block emails that are disposable, invalid, or have no MX records
//   block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
// } satisfies EmailOptions;

// const botOptions = {
//   mode: "LIVE",
//   // configured with a list of bots to allow from
//   // https://arcjet.com/bot-list
//   allow: [], // prevents bots from submitting the form
// } satisfies BotOptions;

// const rateLimitOptions = {
//   mode: "LIVE",
//   interval: "2m", // counts requests over a 2 minute sliding window
//   max: 5, // allows 5 submissions within the window
// } satisfies SlidingWindowRateLimitOptions<[]>;

// const signupOptions = {
//   email: emailOptions,
//   // uses a sliding window rate limit
//   bots: botOptions,
//   // It would be unusual for a form to be submitted more than 5 times in 10
//   // minutes from the same IP address
//   rateLimit: rateLimitOptions,
// } satisfies ProtectSignupOptions<[]>;

// async function protect(req: NextRequest): Promise<ArcjetDecision> {
//   const session = await auth.api.getSession({
//     headers: req.headers,
//   });

//   // If the user is logged in we'll use their ID as the identifier. This
//   // allows limits to be applied across all devices and sessions (you could
//   // also use the session ID). Otherwise, fall back to the IP address.
//   let userId: string;
//   if (session?.user.id) {
//     userId = session.user.id;
//   } else {
//     userId = ip(req) || "127.0.0.1"; // Fall back to local IP if none
//   }

//   // If this is a signup then use the special protectSignup rule
//   // See https://docs.arcjet.com/signup-protection/quick-start
//   if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
//     // Better-Auth reads the body, so we need to clone the request preemptively
//     const body = await req.clone().json();

//     // If the email is in the body of the request then we can run
//     // the email validation checks as well. See
//     // https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
//     if (typeof body.email === "string") {
//       return arcjet
//         .withRule(protectSignup(signupOptions))
//         .protect(req, { email: body.email, userId });
//     } else {
//       // Otherwise use rate limit and detect bot
//       return arcjet
//         .withRule(detectBot(botOptions))
//         .withRule(slidingWindow(rateLimitOptions))
//         .protect(req, { userId });
//     }
//   } else {
//     // For all other auth requests
//     return arcjet.withRule(detectBot(botOptions)).protect(req, { userId });
//   }
// }

// const authHandlers = toNextJsHandler(auth.handler);

// export const { GET } = authHandlers;

// // Wrap the POST handler with Arcjet protections
// export const POST = async (req: NextRequest) => {
//   const decision = await protect(req);

//   console.log("Arcjet Decision:", decision);

//   if (decision.isDenied()) {
//     if (decision.reason.isRateLimit()) {
//       return new Response(null, { status: 429 });
//     } else if (decision.reason.isEmail()) {
//       let message: string;

//       if (decision.reason.emailTypes.includes("INVALID")) {
//         message = "Email address format is invalid. Is there a typo?";
//       } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
//         message = "We do not allow disposable email addresses.";
//       } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
//         message =
//           "Your email domain does not have an MX record. Is there a typo?";
//       } else {
//         // This is a catch all, but the above should be exhaustive based on the
//         // configured rules.
//         message = "Invalid email.";
//       }

//       return Response.json({ message }, { status: 400 });
//     } else {
//       return new Response(null, { status: 403 });
//     }
//   }

//   return authHandlers.POST(req);
// };





/* eslint-disable @typescript-eslint/no-unused-vars */
import ip from "@arcjet/ip";
import {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import arcjet, { detectBot, protectSignup, slidingWindow } from "@/lib/arcjet";

const isDevelopment = process.env.NODE_ENV === 'development';

const emailOptions = {
  mode: isDevelopment ? "DRY_RUN" : "LIVE", // Use DRY_RUN in development to avoid delays
  // Block emails that are disposable, invalid, or have no MX records
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: isDevelopment ? "DRY_RUN" : "LIVE",
  // configured with a list of bots to allow from
  // https://arcjet.com/bot-list
  allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

const rateLimitOptions = {
  mode: isDevelopment ? "DRY_RUN" : "LIVE",
  interval: "2m", // counts requests over a 2 minute sliding window
  max: 5, // allows 5 submissions within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  // It would be unusual for a form to be submitted more than 5 times in 10
  // minutes from the same IP address
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // If the user is logged in we'll use their ID as the identifier. This
  // allows limits to be applied across all devices and sessions (you could
  // also use the session ID). Otherwise, fall back to the IP address.
  let fingerprint: string;
  if (session?.user?.id) {
    fingerprint = session.user.id;
  } else {
    fingerprint = ip(req) || "127.0.0.1"; // Fall back to local IP if none
  }

  // If this is a signup then use the special protectSignup rule
  // See https://docs.arcjet.com/signup-protection/quick-start
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
    // Better-Auth reads the body, so we need to clone the request preemptively
    const body = await req.clone().json();

    // If the email is in the body of the request then we can run
    // the email validation checks as well. See
    // https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
    if (typeof body.email === "string") {
      return arcjet
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, fingerprint });
    } else {
      // Otherwise use rate limit and detect bot
      return arcjet
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(rateLimitOptions))
        .protect(req, { fingerprint });
    }
  } else {
    // For all other auth requests
    return arcjet.withRule(detectBot(botOptions)).protect(req, { fingerprint });
  }
}

const authHandlers = toNextJsHandler(auth.handler);

// Skip Arcjet protection for GET requests in development
export const GET = async (req: NextRequest) => {
  if (isDevelopment) {
    return authHandlers.GET(req);
  }
  
  // In production, you might want to add some protection here
  return authHandlers.GET(req);
};

// Wrap the POST handler with Arcjet protections
export const POST = async (req: NextRequest) => {
  // Skip Arcjet protection in development to avoid delays
  if (isDevelopment) {
    return authHandlers.POST(req);
  }

  const decision = await protect(req);

  // console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your email domain does not have an MX record. Is there a typo?";
      } else {
        // This is a catch all, but the above should be exhaustive based on the
        // configured rules.
        message = "Invalid email.";
      }

      return Response.json({ message }, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }

  return authHandlers.POST(req);
};