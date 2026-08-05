"use client";

import {
    useRef,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
    deleteTestimonial,
    moveTestimonialToPending,
    publishTestimonial,
    rejectTestimonial,
    type TestimonialAdminResult,
} from "@/actions/testimonial-actions";

type TestimonialStatus =
    | "PENDING"
    | "PUBLISHED"
    | "REJECTED";

type TestimonialModerationControlsProps = {
    testimonialId: string;
    testimonialName: string;
    status: TestimonialStatus;
    hasImage: boolean;
    hasConsent: boolean;
};

type ActionName =
    | "publish"
    | "reject"
    | "pending"
    | "delete";

type TestimonialAction = (
    testimonialId: string,
) => Promise<TestimonialAdminResult>;

export default function TestimonialModerationControls({
    testimonialId,
    testimonialName,
    status,
    hasImage,
    hasConsent,
}: TestimonialModerationControlsProps) {
    const router = useRouter();

    const [error, setError] =
        useState<string | null>(null);

    const [activeAction, setActiveAction] =
        useState<ActionName | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const actionLockRef = useRef(false);

    const canPublish =
        hasImage && hasConsent;

    function runAction(
        actionName: ActionName,
        action: TestimonialAction,
    ) {
        if (actionLockRef.current) {
            return;
        }

        if (actionName === "delete") {
            const confirmed = window.confirm(
                `Permanently delete the testimonial from ${testimonialName}?`,
            );

            if (!confirmed) {
                return;
            }
        }

        actionLockRef.current = true;
        setError(null);
        setActiveAction(actionName);

        startTransition(async () => {
            try {
                const result =
                    await action(testimonialId);

                if (!result.success) {
                    setError(
                        result.message ??
                        "The testimonial could not be updated.",
                    );

                    return;
                }

                router.refresh();
            } catch (error) {
                console.error(
                    "Unexpected testimonial moderation error:",
                    error,
                );

                setError(
                    "The testimonial could not be updated. Please try again.",
                );
            } finally {
                actionLockRef.current = false;
                setActiveAction(null);
            }
        });
    }

    return (
        <div className="border-t border-neutral-700 pt-5">
            {!canPublish &&
                status !== "PUBLISHED" && (
                    <p className="mb-4 text-xs leading-5 text-amber-400">
                        Publishing requires customer
                        permission and a testimonial image.
                    </p>
                )}

            <div className="flex flex-wrap gap-3">
                {status !== "PUBLISHED" && (
                    <button
                        type="button"
                        disabled={
                            isPending ||
                            !canPublish
                        }
                        onClick={() =>
                            runAction(
                                "publish",
                                publishTestimonial,
                            )
                        }
                        title={
                            canPublish
                                ? "Publish testimonial"
                                : "Upload an image and confirm consent first"
                        }
                        className="rounded-md bg-primary-hover px-4 py-2 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {activeAction === "publish"
                            ? "Publishing..."
                            : "Publish"}
                    </button>
                )}

                {status !== "PENDING" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction(
                                "pending",
                                moveTestimonialToPending,
                            )
                        }
                        className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "pending"
                            ? "Updating..."
                            : "Move to pending"}
                    </button>
                )}

                {status !== "REJECTED" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction(
                                "reject",
                                rejectTestimonial,
                            )
                        }
                        className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "reject"
                            ? "Rejecting..."
                            : "Reject"}
                    </button>
                )}

                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                        runAction(
                            "delete",
                            deleteTestimonial,
                        )
                    }
                    className="ml-auto rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {activeAction === "delete"
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </div>
    );
}