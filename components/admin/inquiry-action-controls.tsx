"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    updateInquiryStatus,
    deleteInquiry,
    type InquiryStatus,
    type InquiryActionResult,
} from "@/actions/inquiry-actions";

type InquiryActionControlsProps = {
    inquiryId: string;
    inquiryName: string;
    status: InquiryStatus;
};

type ActionName =
    | "read"
    | "replied"
    | "archive"
    | "new"
    | "delete";

type InquiryAction = () => Promise<InquiryActionResult>;

export default function InquiryActionControls({
    inquiryId,
    inquiryName,
    status,
}: InquiryActionControlsProps) {
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<ActionName | null>(null);
    const [isPending, startTransition] = useTransition();

    const actionLockRef = useRef(false);

    function runAction(actionName: ActionName, action: InquiryAction) {
        if (actionLockRef.current) {
            return;
        }

        if (actionName === "delete") {
            const confirmed = window.confirm(
                `Permanently delete the message from ${inquiryName}?`,
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
                const result = await action();

                if (!result.success) {
                    setError(
                        result.message ?? "The message status could not be updated.",
                    );
                    return;
                }

                router.refresh();
            } catch (error) {
                console.error("Unexpected message action error:", error);
                setError("The message could not be updated. Please try again.");
            } finally {
                actionLockRef.current = false;
                setActiveAction(null);
            }
        });
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3">
                {status === "NEW" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction("read", () =>
                                updateInquiryStatus(inquiryId, "READ"),
                            )
                        }
                        className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "read" ? "Marking..." : "Mark as read"}
                    </button>
                )}

                {(status === "NEW" || status === "READ" || status === "ARCHIVED") && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction("replied", () =>
                                updateInquiryStatus(inquiryId, "REPLIED"),
                            )
                        }
                        className="rounded-md bg-violet-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "replied" ? "Marking..." : "Mark as replied"}
                    </button>
                )}

                {status !== "ARCHIVED" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction("archive", () =>
                                updateInquiryStatus(inquiryId, "ARCHIVED"),
                            )
                        }
                        className="rounded-md border border-neutral-600 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "archive" ? "Archiving..." : "Archive"}
                    </button>
                )}

                {status !== "NEW" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            runAction("new", () =>
                                updateInquiryStatus(inquiryId, "NEW"),
                            )
                        }
                        className="rounded-md border border-primary/45 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary-lighter transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeAction === "new" ? "Marking..." : "Mark as new"}
                    </button>
                )}

                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runAction("delete", () => deleteInquiry(inquiryId))}
                    className="ml-auto rounded-md border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {activeAction === "delete" ? "Deleting..." : "Delete"}
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs text-red-300"
                >
                    {error}
                </div>
            )}
        </div>
    );
}
