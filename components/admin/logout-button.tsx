"use client";

import {
    useRef,
    useState,
    useTransition,
} from "react";

import { logoutAdmin } from "@/actions/auth-action";

export default function LogoutButton() {
    const [error, setError] = useState<
        string | null
    >(null);

    const [isPending, startTransition] =
        useTransition();

    /*
     * Prevents a second click immediately, even
     * before React rerenders the disabled button.
     */
    const logoutLockRef = useRef(false);

    function handleLogout() {
        if (logoutLockRef.current) {
            return;
        }

        logoutLockRef.current = true;
        setError(null);

        startTransition(async () => {
            try {
                await logoutAdmin();

                /*
                 * Successful logout redirects to /login,
                 * so normal execution should not continue.
                 */
            } catch (unexpectedError) {
                console.error(
                    "Unexpected logout error:",
                    unexpectedError,
                );

                setError(
                    "Sign out failed. Please try again.",
                );

                logoutLockRef.current = false;
            }
        });
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="w-full rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending
                    ? "Signing out..."
                    : "Sign out"}
            </button>

            {error && (
                <p
                    role="alert"
                    className="mt-2 text-xs leading-5 text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}