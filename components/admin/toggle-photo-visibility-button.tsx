"use client";

import { useRouter } from "next/navigation";
import {
    useState,
    useTransition,
} from "react";

import { togglePhotoVisibility } from "@/actions/photo-action";

type TogglePhotoVisibilityButtonProps = {
    photoId: string;
    isVisible: boolean;
};

export default function TogglePhotoVisibilityButton({
    photoId,
    isVisible,
}: TogglePhotoVisibilityButtonProps) {
    const router = useRouter();

    const [error, setError] = useState<string | null>(
        null,
    );

    const [isPending, startTransition] =
        useTransition();

    function handleToggleVisibility() {
        setError(null);

        startTransition(async () => {
            const result =
                await togglePhotoVisibility(photoId);

            if (!result.success) {
                setError(
                    result.message ??
                    "The photograph visibility could not be changed.",
                );

                return;
            }

            router.refresh();
        });
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleToggleVisibility}
                disabled={isPending}
                className={
                    isVisible
                        ? "text-sm font-medium text-amber-400 transition hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                        : "text-sm font-medium text-primary-light transition hover:text-primary-lighter disabled:cursor-not-allowed disabled:opacity-50"
                }
            >
                {isPending
                    ? "Updating..."
                    : isVisible
                        ? "Hide"
                        : "Show"}
            </button>

            {error && (
                <p
                    role="alert"
                    className="mt-2 max-w-44 text-xs leading-5 text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}