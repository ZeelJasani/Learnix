// import { AdminCourseType } from "@/app/not-admin/admin-get-courses";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { useConstructUrl } from "@/hooks/use-construct-url";
// import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";


// interface iAppProps {
//     data: AdminCourseType;
// }

// export function AdminCourseCard({ data }: iAppProps) {


//     const CourseImage = useConstructUrl(data.fileKey)
//     return (
//         <Card className="group relative py-0 gap-0">
//             {/* absolute dropdown */}
//             <div className="absolute top-2 right-2 z-10">
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="secondary" size="icon">
//                             <MoreVertical className="size-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48">
//                         <DropdownMenuItem asChild>
//                             <Link href={`/admin/courses/${data.id}/edit`}>
//                                 <Pencil className="size-4 mr-2" />
//                                 Edit Course
//                             </Link>
//                         </DropdownMenuItem>

//                         <DropdownMenuItem asChild>
//                             <Link href={`/courses/${data.slug}`}>
//                                 <Eye className="size-4 mr-2" />
//                                 Preview
//                             </Link>
//                         </DropdownMenuItem>

//                         <DropdownMenuSeparator>
//                             <DropdownMenuItem asChild>
//                                 <Link href={`/courses/${data.id}/delete`}>
//                                     <Trash2 className="size-4 mr-2 text-destructive" />
//                                     Delete course
//                                 </Link>
//                             </DropdownMenuItem>

//                         </DropdownMenuSeparator>
//                     </DropdownMenuContent>
//                 </DropdownMenu>

//             </div>
//             <Image
//                 src={CourseImage}
//                 alt="Course image"
//                 width={600}
//                 height={400}
//                 className="w-full rounded-t-lg aspect-video h-full object-cover"
//             />
//             <CardContent className="p-4">
//                 <Link
//                     href={`/admin/courses/${data.id}/edit`}
//                     className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
//                 >
//                     {data.title}
//                 </Link>

//                 <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
//                     {data.smallDescription}
//                 </p>
//                 <div className="mt-4 flex items-center gap-x-5">
//                     <div className="flex items-center gap-x-2">
//                         <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
//                         <p className="text-sm text-muted-foreground">
//                             {data.duration}h
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-x-2">
//                         <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
//                         <p className="text-sm text-muted-foreground">
//                             {data.level}h
//                         </p>
//                     </div>
//                 </div>



//                 <Link
//                     className={buttonVariants({
//                         className: "w-full mt-4",
//                     })}
//                     href={`/admin/courses/${data.id}/edit`}>
//                     Edit Course <ArrowRight className="size-4" />

//                 </Link>
//             </CardContent>
//         </Card>
//     );
// }




// // masteji-mordern-lms.t3.storageapi.dev










import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
    const CourseImage = useConstructUrl(data.fileKey);
    return (
        <Card className="group relative py-0 gap-0">

            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="bg-black/40 hover:bg-black/60 border-none text-white">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-48 bg-[#2D2D2D] border-gray-700 text-gray-200"
                    >

                        <DropdownMenuItem asChild className="cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 hover:!text-white">
                            <Link href={`/admin/courses/${data.id}/edit`}>
                                <Pencil className="size-4 mr-2" />
                                Edit Course
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 hover:!text-white">
                            <Link href={`/courses/${data.slug}`}>
                                <Eye className="size-4 mr-2" />
                                Preview
                            </Link>
                        </DropdownMenuItem>

                        {/* [FIXED] Separator બે આઇટમ્સની વચ્ચે હોવો જોઈએ */}
                        <DropdownMenuSeparator className="bg-gray-700" />

                        {/* [CHANGE HERE] ડિલીટ આઇટમને લાલ કલર અને કસ્ટમ સ્ટાઇલ આપી */}
                        <DropdownMenuItem asChild className="cursor-pointer text-red-400 hover:!bg-red-500/10 focus:!bg-red-500/10 hover:!text-red-400">
                            <Link href={`/admin/courses/${data.id}/delete`}>
                                <Trash2 className="size-4 mr-2" />
                                Delete course
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image
                src={CourseImage}
                alt="Course image"
                width={600}
                height={400}
                className="w-full rounded-t-lg aspect-video h-full object-cover"
            />
            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${data.id}/edit`}
                    className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                >
                    {data.title}
                </Link>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                    {data.smallDescription}
                </p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">
                            {data.duration}h
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">
                            {data.level}
                        </p>
                    </div>
                </div>

                <Link
                    className={buttonVariants({
                        className: "w-full mt-4",
                    })}
                    href={`/admin/courses/${data.id}/edit`}>
                    Edit Course <ArrowRight className="size-4 ml-2" />
                </Link>
            </CardContent>
        </Card>
    );
}



export function AdminCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="size-8 rounded-md" />
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
            </div>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-4 rounded" />
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                </div>

                <Skeleton className="mt-4 h-10 w-full rounded" />
            </CardContent>
        </Card>
    );
}