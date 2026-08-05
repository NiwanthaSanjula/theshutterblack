"use client"

import { useRouter } from "next/navigation";
import {
    useState,
    useTransition,
} from "react";

import { setAlbumCover } from "@/actions/photo-action";

type SetAlbumCoverButtonProps = {
    photoId: string;
    isCover: boolean;
    isVisible: boolean;
}

export default function SetAlbumCoverButton({
    photoId,
    isCover,
    isVisible,
}: SetAlbumCoverButtonProps) {
    const router = useRouter();

    const [error, setError] = useState<string | null>(
        null
    );

    const [isPending, startTransition] = useTransition();

    function handleSetCover() {
        setError(null);

        startTransition(async () => {
            const result = await setAlbumCover(photoId);

            if (!result.success) {
                setError(result.message ?? "The album cover could not be changed.");
                return;
            };

            router.refresh();
        });
    }

    if (!isVisible) {
        return null;
    }

    if (isCover) {
        return (
            <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-300">
                Current cover
            </span>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleSetCover}
                disabled={isPending}
                className="text-sm font-medium text-primary-light transition hover:text-primary-lighter disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending
                    ? "Setting cover..."
                    : "Set as cover"
                }
            </button>

            {error && (
                <p
                    role="alert"
                    className="mt-2 max-w-40 text-xs leading-5 text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    )
}
