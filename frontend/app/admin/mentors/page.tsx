import { adminGetMentors } from "@/app/data/admin/admin-get-mentors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleSelect } from "../users/_components/RoleSelect";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GraduationCap } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminMentorsPage() {
    const mentors = await adminGetMentors();

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Mentors</h1>
                    <p className="text-sm text-muted-foreground">{mentors.length} total mentors</p>
                </div>
            </div>

            <div className="rounded-lg border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[260px]">Mentor</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center w-[100px]">Courses</TableHead>
                            <TableHead className="text-center w-[100px]">Students</TableHead>
                            <TableHead className="text-center w-[140px]">Role</TableHead>
                            <TableHead className="text-right w-[120px]">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                                    No mentors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mentors.map((mentor) => (
                                <TableRow key={mentor.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={mentor.image || ""} />
                                                <AvatarFallback className="text-xs">
                                                    {mentor.name?.slice(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-sm">{mentor.name || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{mentor.email}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-sm font-medium">{mentor.courseCount}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-sm font-medium">{mentor.studentCount}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <RoleSelect
                                            userId={mentor.id}
                                            currentRole="mentor"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right text-sm text-muted-foreground">
                                        {mentor.createdAt
                                            ? new Date(mentor.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
