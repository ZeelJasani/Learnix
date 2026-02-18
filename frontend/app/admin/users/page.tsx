import { getAllUsers } from "@/app/data/admin/get-all-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleSelect } from "./_components/RoleSelect";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SearchUsers } from "./_components/SearchUsers";
import { UserActions } from "./_components/UserActions";
import { Users } from "lucide-react";

interface AdminUsersPageProps {
    searchParams: {
        search?: string;
        page?: string;
    };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const search = searchParams.search || "";
    const users = await getAllUsers(search);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Users</h1>
                        <p className="text-sm text-muted-foreground">{users.length} total users</p>
                    </div>
                </div>
                <div className="w-full sm:w-72">
                    <SearchUsers />
                </div>
            </div>

            <div className="rounded-lg border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[260px]">User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="w-[140px]">Role</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="text-right w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.image || ""} />
                                                <AvatarFallback className="text-xs">
                                                    {user.name?.slice(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-sm">{user.name || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <RoleSelect
                                            userId={user.id}
                                            currentRole={user.role || "user"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`h-2 w-2 rounded-full ${user.banned ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                            <span className="text-xs text-muted-foreground">
                                                {user.banned ? "Banned" : "Active"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActions userId={user.id} isBanned={!!user.banned} />
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
