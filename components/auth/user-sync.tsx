import { syncCurrentUser } from "@/app/data/user/sync-current-user";

export async function UserSync() {
    await syncCurrentUser();
    return null;
}
