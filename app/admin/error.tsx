"use client";

import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-white">
                    Something went wrong
                </h2>
                <p className="mt-2 text-sm text-white/50">
                    This page couldn&apos;t load. Please try again.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 rounded-md bg-primary-hover px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}