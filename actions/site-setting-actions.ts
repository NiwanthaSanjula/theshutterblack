"use server";

import { revalidatePath } from "next/cache";

import { getAdminSession } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { siteSettingSchema } from "@/lib/validations/site-setting";

export type SiteSettingFormValues = {
    businessName: string;
    photographerName: string;
    biography: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    instagramUrl: string;
    facebookUrl: string;
};

export type SiteSettingFormErrors = {
    businessName?: string[];
    photographerName?: string[];
    biography?: string[];
    email?: string[];
    phone?: string[];
    whatsapp?: string[];
    address?: string[];
    instagramUrl?: string[];
    facebookUrl?: string[];
};

export type SiteSettingFormState = {
    success?: boolean;
    message?: string;
    errors?: SiteSettingFormErrors;
    values?: SiteSettingFormValues;
};

function getSiteSettingFormValues(
    formData: FormData,
): SiteSettingFormValues {
    return {
        businessName: String(
            formData.get("businessName") ?? "",
        ),

        photographerName: String(
            formData.get("photographerName") ?? "",
        ),

        biography: String(
            formData.get("biography") ?? "",
        ),

        email: String(
            formData.get("email") ?? "",
        ),

        phone: String(
            formData.get("phone") ?? "",
        ),

        whatsapp: String(
            formData.get("whatsapp") ?? "",
        ),

        address: String(
            formData.get("address") ?? "",
        ),

        instagramUrl: String(
            formData.get("instagramUrl") ?? "",
        ),

        facebookUrl: String(
            formData.get("facebookUrl") ?? "",
        ),
    };
}

function getFieldErrors(
    issues: {
        path: PropertyKey[];
        message: string;
    }[],
): SiteSettingFormErrors {
    const errors: SiteSettingFormErrors = {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (typeof field !== "string") {
            continue;
        }

        if (!(field in errors)) {
            errors[
                field as keyof SiteSettingFormErrors
            ] = [];
        }

        errors[
            field as keyof SiteSettingFormErrors
        ]?.push(issue.message);
    }

    return errors;
}

export async function updateSiteSettings(
    _previousState: SiteSettingFormState,
    formData: FormData,
): Promise<SiteSettingFormState> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const rawValues =
        getSiteSettingFormValues(formData);

    const validationResult =
        siteSettingSchema.safeParse(
            rawValues,
        );

    if (!validationResult.success) {
        return {
            success: false,
            message:
                "Please correct the highlighted fields.",
            errors: getFieldErrors(
                validationResult.error.issues,
            ),
            values: rawValues,
        };
    }

    const validatedData =
        validationResult.data;

    try {
        await prisma.siteSetting.upsert({
            where: {
                id: "main",
            },

            create: {
                id: "main",

                businessName:
                    validatedData.businessName,

                photographerName:
                    validatedData.photographerName ??
                    null,

                biography:
                    validatedData.biography ??
                    null,

                email:
                    validatedData.email ??
                    null,

                phone:
                    validatedData.phone ??
                    null,

                whatsapp:
                    validatedData.whatsapp ??
                    null,

                address:
                    validatedData.address ??
                    null,

                instagramUrl:
                    validatedData.instagramUrl ??
                    null,

                facebookUrl:
                    validatedData.facebookUrl ??
                    null,
            },

            update: {
                businessName:
                    validatedData.businessName,

                photographerName:
                    validatedData.photographerName ??
                    null,

                biography:
                    validatedData.biography ??
                    null,

                email:
                    validatedData.email ??
                    null,

                phone:
                    validatedData.phone ??
                    null,

                whatsapp:
                    validatedData.whatsapp ??
                    null,

                address:
                    validatedData.address ??
                    null,

                instagramUrl:
                    validatedData.instagramUrl ??
                    null,

                facebookUrl:
                    validatedData.facebookUrl ??
                    null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to update site settings:",
            error,
        );

        return {
            success: false,
            message:
                "The site settings could not be saved. Please try again.",
            values: rawValues,
        };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return {
        success: true,
        message:
            "Site settings have been saved.",
        values: rawValues,
    };
}