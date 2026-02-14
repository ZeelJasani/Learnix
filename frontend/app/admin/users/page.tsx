/**
 * Admin Users Page — Platform na badha users ni management page
 * Admin Users Page — All users management page for the platform
 *
 * Aa server component chhe je badha users ne table format ma display kare chhe
 * This is a server component that displays all users in table format
 *
 * Features:
 * - Table columns — Avatar, Name, Email, Role (with RoleSelect), Joined date
 * - RoleSelect component — Inline role change dropdown (user ↔ mentor ↔ admin)
 * - getAllUsers() — Backend thi badha users fetch kare chhe
 *   getAllUsers() — Fetches all users from backend
 */
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
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage and view all users in the system.
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <SearchUsers />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.image || ""} />
                                        <AvatarFallback>
                                            {user.name?.slice(0, 2).toUpperCase() || "??"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <RoleSelect
                                        userId={user.id}
                                        currentRole={user.role || "user"}
                                    />
                                </TableCell>
                                <TableCell>
                                    {user.banned ? (
                                        <Badge variant="destructive">Banned</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                            Active
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <UserActions userId={user.id} isBanned={!!user.banned} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
