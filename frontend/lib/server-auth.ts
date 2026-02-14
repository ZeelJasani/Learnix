import "server-only";

/**
 * Server-side mate Clerk auth token melvva mate helper function
 * Helper function to get Clerk auth token for server-side usage
 *
 * Aa function server-side rendering (SSR) mate vaparay chhe jyare
 * API calls server component mathi karva hoy tyare.
 * This function is used for server-side rendering (SSR) when
 * API calls need to be made from server components.
 *
 * @returns Clerk auth token or null if not available
 */
export async function getAuthToken(): Promise<string | null> {
    try {
        const { auth } = await import('@clerk/nextjs/server');
        const { getToken } = await auth();
        return await getToken();
    } catch {
        return null;
    }
}
