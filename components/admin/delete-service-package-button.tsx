"use client";

import {
    useRef,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { deleteServicePackage } from "@/actions/service-package-actions";

type DeleteServicePackageButtonProps = {
    packageId: string;
    packageName: string;
};

export default function DeleteServicePackageButton({
    packageId,
    packageName,
}: DeleteServicePackageButtonProps) {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const deletionLockRef = useRef(false);

    function openDialog() {
        setError(null);
        setIsDialogOpen(true);
    }

    function closeDialog() {
        if (isPending) {
            return;
        }

        setError(null);
        setIsDialogOpen(false);
    }

    function handleDelete() {
        if (deletionLockRef.current) {
            return;
        }

        deletionLockRef.current = true;
        setError(null);

        startTransition(async () => {
            try {
                const result =
                    await deleteServicePackage(
                        packageId,
                    );

                if (!result.success) {
                    setError(
                        result.message ??
                        "The package could not be deleted.",
                    );

                    return;
                }

                setIsDialogOpen(false);
                router.refresh();
            } catch (error) {
                console.error(
                    "Unexpected package deletion error:",
                    error,
                );

                setError(
                    "The package could not be deleted. Please try again.",
                );
            } finally {
                deletionLockRef.current = false;
            }
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={openDialog}
                disabled={isPending}
                className="rounded border border-red-500/50 bg-red-500/25 px-2 py-1 text-sm font-medium text-red-500 transition hover:bg-red-500/50 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Delete
            </button>

            {isDialogOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDialog();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-package-title-${packageId}`}
                        aria-describedby={`delete-package-description-${packageId}`}
                        className="w-full max-w-md rounded-xl border border-neutral-600 border-l-4 border-l-red-500 bg-linear-90 from-neutral-500/15 to-neutral-300/15 p-6 text-left shadow-lg shadow-black/80 backdrop-blur-xs"
                    >
                        <h2
                            id={`delete-package-title-${packageId}`}
                            className="text-sm font-black tracking-wide text-neutral-200"
                        >
                            Delete package?
                        </h2>

                        <p
                            id={`delete-package-description-${packageId}`}
                            className="mt-3 text-sm leading-6 text-neutral-300/75"
                        >
                            You are about to permanently
                            delete{" "}
                            <strong className="font-semibold text-neutral-300">
                                {packageName}
                            </strong>
                            .
                        </p>

                        <p className="mt-4 text-sm font-medium text-red-500">
                            This action cannot be undone.
                        </p>

                        {error && (
                            <div
                                role="alert"
                                className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={isPending}
                                className="rounded-md bg-neutral-600 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending
                                    ? "Deleting package..."
                                    : "Delete permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}