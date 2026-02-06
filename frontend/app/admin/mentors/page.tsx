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

export const dynamic = 'force-dynamic';

export default async function AdminMentorsPage() {
    const mentors = await adminGetMentors();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mentors</h1>
                    <p className="text-muted-foreground">
                        View and manage mentors on the platform.
                    </p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Courses</TableHead>
                            <TableHead className="text-center">Students</TableHead>
                            <TableHead className="text-center">Manage Role</TableHead>
                            <TableHead className="text-right">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No mentors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mentors.map((mentor) => (
                                <TableRow key={mentor.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={mentor.image || ""} />
                                            <AvatarFallback>
                                                {mentor.name?.slice(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{mentor.name || "N/A"}</TableCell>
                                    <TableCell>{mentor.email}</TableCell>
                                    <TableCell className="text-center">{mentor.courseCount}</TableCell>
                                    <TableCell className="text-center">{mentor.studentCount}</TableCell>
                                    <TableCell className="text-center">
                                        <RoleSelect
                                            userId={mentor.id}
                                            currentRole="mentor"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
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
