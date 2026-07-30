import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Reads the Auth.js session and confirm that it belongs to the configured CMS administrator.
 * 
 * This function does not redirect, so it can later be reused inside server Actions and Route Handlers.
 */
export async function getAdminSession() {
    const session = await auth();

    const configuredAdminEmail =
        process.env.ADMIN_EMAIL
            ?.trim()
            .toLocaleLowerCase();

    const sessionEmail =
        session?.user?.email
            ?.trim()
            .toLocaleLowerCase();

    /**
     * Authentication configuration is missing.
     */
    if (!configuredAdminEmail) {
        console.error("ADMIN_EMAIL is not configured.");

        return null;
    };

    /**
     * No logged-in user or the logged-in user does not match the configured administrator.
     */
    if (!session?.user || !sessionEmail || sessionEmail !== configuredAdminEmail) {
        return null;
    }

    return session;
}

/**
 * Used by protected pages and layouts.
 * 
 * If no valid administrator session exists, redirect the request to the login page.
 */
export async function requireAdmin() {
    const session = await getAdminSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}



