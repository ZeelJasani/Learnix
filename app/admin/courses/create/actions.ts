// "use server";

// import { prisma } from "@/lib/db";
// import { ApiResponse } from "@/lib/types";
// import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";


// export async function CreateCourse(data: CourseSchemaType): Promise<ApiResponse>{
//   try {
//     const validation = courseSchema.safeParse(data);

//     if (!validation.success) {
//       return {
//         status: "error",
//         message: "Invalid Form Data",
//       };
//     }


//     const data = await prisma.course.create({
//         data: {
//             ...validation.data,
//             userId: "zeel",
//         },
//     });


//     return {
//         status: "success",
//         message: "course created successfully",
//     };

//     // ... rest of the logic
//   } catch {
//     return {
//         status: 'error',
//         message: 'failed to create' 
//     }
//   }
// }






"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
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


export async function CreateCourse(courseInput: CourseSchemaType): Promise<ApiResponse>{

  const session = await requireAdmin();
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


    const data = await stripe.products.create({
        name: validation.data.title,
        description: validation.data.smallDescription,
        default_price_data: {
            currency: 'inr',
            unit_amount: validation.data.price * 100,
        }
    })

    const courseData = await prisma.course.create({
        data: {
            ...validation.data,
            userId: session?.user.id as string,
            stripePriceId: data.default_price as string,
        },
    });


    return {
        status: "success",
        message: "course created successfully",
    };

  } catch {
    return {
        status: 'error',
        message: 'failed to create' 
    }
  }
} 