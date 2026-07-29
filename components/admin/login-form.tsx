"use client"

import {
    useActionState,
    useEffect,
    useRef
} from "react"

import {
    loginAdmin,
    type LoginActionState
} from '@/actions/auth-action';

const initialStae: LoginActionState = {
    error: null,
};

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAdmin,
        initialStae
    );

    /**
     * This immediatly block rapid duplicate submission before React finishes rendering the disabled button,
     */
    const submissionLockRef = useRef(false);

    useEffect(() => {
        /**
         * Unlock the form after a failed login has finished. Successful login redirect away.
         */
        if (!isPending) {
            submissionLockRef.current = false;
        }
    }, [isPending]);


    return (
        <form
            action={formAction}
            onSubmit={(event) => {
                if (submissionLockRef.current) {
                    event.preventDefault();
                    return;
                }
                submissionLockRef.current = true
            }}
            className="mt-8 space-y-5"

        >
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-200"
                >
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    disabled={isPending}
                    placeholder="admin@example.com"
                    className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-200"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={1}
                    maxLength={128}
                    autoComplete="current-password"
                    disabled={isPending}
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div
                aria-live="polite"
                className="min-h-12"
            >
                {state.error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
                    >
                        {state.error}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending
                    ? "Signing in..."
                    : "Sign in to CMS"}
            </button>
        </form>
    )
}