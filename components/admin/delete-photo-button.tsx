"use client"

import { deletePhoto } from "@/actions/photo-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DeletePhotoButtonProps = {
    photoId: string;
    photoLabel: string;
    isCover?: boolean;
};

export default function DeletePhotoButton({
    photoId,
    photoLabel,
    isCover = false,
}: DeletePhotoButtonProps) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(
        null,
    );
    const [isPending, startTransition] = useTransition();

    function openDialog() {
        setError(null);
        setIsOpen(true);
    }

    function closeDialog() {
        if (isPending) {
            return;
        }

        setError(null);
        setIsOpen(false);
    }

    function handleDelete() {
        setError(null);

        startTransition(async () => {
            const result = await deletePhoto(photoId);

            if (!result.success) {
                setError(
                    result.message ??
                    "The photograph could not be deleted.",
                );

                return;
            }

            setIsOpen(false);
            router.refresh();
        })
    }

    return (
        <>
            <button
                type="button"
                onClick={openDialog}
                className="text-sm font-medium text-red-400 transition hover:text-red-300"
            >
                Delete
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDialog();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-photo-title-${photoId}`}
                        aria-describedby={`delete-photo-description-${photoId}`}
                        className="w-full max-w-md rounded-xl border border-l-3 border-l-red-500 border-neutral-700/70 bg-neutral-900/70 backdrop-blur-xs p-6 text-left shadow-2xl"
                    >
                        <h2
                            id={`delete-photo-title-${photoId}`}
                            className="mt-5 text-xl font-semibold text-white"
                        >
                            Delete photograph?
                        </h2>

                        <p
                            id={`delete-photo-description-${photoId}`}
                            className="mt-3 text-sm leading-6 text-neutral-400"
                        >
                            <strong className="font-medium text-neutral-200">
                                {photoLabel}
                            </strong>{" "}
                            will be permanently removed from the album,
                            Cloudinary and the database.
                        </p>

                        {isCover && (
                            <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                                This is currently the album cover. The next
                                visible photograph will become the new cover.
                            </div>
                        )}

                        <p className="mt-4 text-sm font-medium text-red-400">
                            This action cannot be undone.
                        </p>

                        {error && (
                            <div
                                role="alert"
                                className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={isPending}
                                className="rounded-md border border-neutral-600 px-4 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending
                                    ? "Deleting..."
                                    : "Delete permanently"}
                            </button>
                        </div>

                    </div>

                </div>
            )}
        </>
    )

}