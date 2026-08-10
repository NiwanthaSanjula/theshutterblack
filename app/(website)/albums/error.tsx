"use client";

import { useEffect } from "react";

export default function AlbumsError({
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
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="text-center">
                <h2 className="font-serif text-2xl text-white">
                    Something went wrong
                </h2>
                <p className="mt-2 text-white/50">
                    We couldn&apos;t load this page. Please try again.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="
                        mt-6 rounded-full bg-primary
                        px-6 py-2.5 text-sm font-medium
                        text-neutral-950
                        transition hover:bg-primary/85
                    "
                >
                    Try again
                </button>
            </div>
        </main>
    );
}