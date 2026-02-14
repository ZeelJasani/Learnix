import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { requireUser } from "@/app/data/user/require-user";

export const dynamic = 'force-dynamic';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/general/EmptyState";

interface Student {
    id: string;
    student: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
    course: {
        id: string;
        title: string;
    };
    enrolledAt: string;
    amount: number;
}

export default async function MentorStudentsPage() {
    await requireUser();
    const token = await getAuthToken();

    // Handle both direct user object and wrapped {synced, user} structure
    // const user = ('user' in userData ? (userData as any).user : userData);

    const studentsResponse = await api.get<Student[]>(
        "/mentor/students",
        token ?? undefined
    );

    const students = studentsResponse.data || [];

    return (
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">My Students</h2>
                    <p className="text-muted-foreground">
                        Students enrolled in your courses
                    </p>
                </div>
            </div>

            <Separator />

            {students.length === 0 ? (
                <EmptyState
                    title="No students found"
                    description="No students have enrolled in your courses yet."
                    buttonText=""
                    href="#"
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Enrolled Date</TableHead>
                                <TableHead className="text-right">Amount Paid</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={enrollment.student.image || ""} />
                                            <AvatarFallback>
                                                {enrollment.student.name?.slice(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{enrollment.student.name}</span>
                                            <span className="text-xs text-muted-foreground">{enrollment.student.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{enrollment.course.title}</TableCell>
                                    <TableCell>
                                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₹{(enrollment.amount / 100).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
