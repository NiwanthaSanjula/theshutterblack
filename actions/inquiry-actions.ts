"use server";

import { getAdminSession } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type InquiryStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type InquiryActionResult = {
    success: boolean;
    message?: string;
};

export async function updateInquiryStatus(
    inquiryId: string,
    status: InquiryStatus,
): Promise<InquiryActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    try {
        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: { status },
        });

        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to update inquiry status:", error);
        return {
            success: false,
            message: "Could not update message status in the database.",
        };
    }
}

export async function deleteInquiry(
    inquiryId: string,
): Promise<InquiryActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    try {
        await prisma.inquiry.delete({
            where: { id: inquiryId },
        });

        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete inquiry:", error);
        return {
            success: false,
            message: "Could not delete the message from the database.",
        };
    }
}
