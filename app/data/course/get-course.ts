// import { prisma } from "@/lib/db";
// import { notFound } from "next/navigation";

// export async function getIndividualCourse() {
//     const course = await prisma.course.findUnique({
//         where: {
//             id: true,
//             title: true,
//             description: true,
//             fileKey: true,
//             price: true,
//             duration: true,
//             level: true,
//             category: true,
//             smallDescription: true,
//             chapter: {
//                 select: {
//                     id: true,
//                     title: true,
//                     lesson: {
//                         select: {
//                             id: true,
//                             title: true,
//                         },
//                         orderBy: {
//                             createdAt: 'asc'
//                         }
//                     },
//                 },
//                 orderBy: {
//                     createdAt: 'asc'
//                 },
//             },
//         },
//     });


//     if(!course) {
//         return notFound();
//     }


//     return course;
// } 









import "server-only";



// ...existing code...
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            category: true,
            smallDescription: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    },
                },
                orderBy: {
                    createdAt: 'asc'
                },
            },
        },
    });

    if (!course) {
        return notFound();
    }

    return course;
}
// ...existing code...