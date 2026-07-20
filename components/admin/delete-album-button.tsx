"use client"

import { deleteAlbum } from "@/actions/album-actions"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

type DeleteAlbumButtonProps = {
    albumId: string;
    albumTitle: string;
    photoCount: number;
};

export default function DeleteAlbumButton({
    albumId,
    albumTitle,
    photoCount
}: DeleteAlbumButtonProps) {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

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
        setError(null);

        startTransition(async () => {
            const result = await deleteAlbum(albumId);

            if (!result.success) {
                setError(
                    result.message ?? "The album could not be deleted."
                );

                return;
            }

            setIsDialogOpen(false);
            router.refresh();
        })
    }

    return (
        <>
            <button
                type="button"
                onClick={openDialog}
                disabled={isPending}
                className="text-sm font-medium text-red-500 transition bg-red-500/25 border border-red-500/50 hover:bg-red-500/50 hover:text-red-300 px-2 py-1 rounded"
            >
                Delete
            </button>

            {isDialogOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDialog();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-labelledby={`delete-album-title-${albumId}`}
                        aria-describedby={`delete-album-description-${albumId}`}
                        className="w-full max-w-md rounded-xl bg-linear-90 from-neutral-500/15 to-neutral-300/15 backdrop-blur-xs border border-neutral-600 p-6 text-left shadow-lg shadow-black/80 border-l-4 border-l-red-500"
                    >

                        <h2
                            id={`delete-album-title-${albumId}`}
                            className="mt-3 text-sm font-black tracking-wide text-neutral-200"
                        >
                            Delete Album?
                        </h2>

                        <p
                            id={`delete-album-description-${albumId}`}
                            className="mt-3 text-sm leading-6 text-neutral-300/75"
                        >
                            You are about to permanently delete{" "}
                            <strong className="font-semibold text-neutral-300">
                                {albumTitle}
                            </strong>
                            .
                        </p>

                        {photoCount > 0 && (
                            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                This album contains {photoCount}{" "}
                                {photoCount === 1 ? "photo" : "photos"}. Its
                                associated photo records will also be deleted.
                            </div>
                        )}

                        <p className="mt-4 text-sm font-medium text-red-500">
                            This action cannot be undone.
                        </p>


                        {error && (
                            <div
                                role="alert"
                                className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={isPending}
                                className="rounded-md bg-neutral-500 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-60 "
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
                                    ? "Deleting album..."
                                    : "Delete permanently"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}