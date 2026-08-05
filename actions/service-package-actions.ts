"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { servicePackageSchema } from "@/lib/validations/service-package";

export type ServicePackageFormValues = {
    name: string;
    shortDescription: string;
    description: string;
    priceLabel: string;
    durationLabel: string;
    featuresText: string;
    status: "DRAFT" | "PUBLISHED";
};

export type ServicePackageFormErrors = {
    name?: string[];
    shortDescription?: string[];
    description?: string[];
    priceLabel?: string[];
    durationLabel?: string[];
    featuresText?: string[];
    status?: string[];
};

export type ServicePackageFormState = {
    message?: string;
    errors?: ServicePackageFormErrors;
    values?: ServicePackageFormValues;
};

export type DeleteServicePackageResult = {
    success: boolean;
    message?: string;
};

function getServicePackageFormValues(
    formData: FormData,
): ServicePackageFormValues {
    return {
        name: String(
            formData.get("name") ?? "",
        ),

        shortDescription: String(
            formData.get("shortDescription") ?? "",
        ),

        description: String(
            formData.get("description") ?? "",
        ),

        priceLabel: String(
            formData.get("priceLabel") ?? "",
        ),

        durationLabel: String(
            formData.get("durationLabel") ?? "",
        ),

        featuresText: String(
            formData.get("featuresText") ?? "",
        ),

        status:
            formData.get("status") === "PUBLISHED"
                ? "PUBLISHED"
                : "DRAFT",
    };
}

function getFieldErrors(
    issues: {
        path: PropertyKey[];
        message: string;
    }[],
): ServicePackageFormErrors {
    const errors: ServicePackageFormErrors = {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (typeof field !== "string") {
            continue;
        }

        if (!(field in errors)) {
            errors[
                field as keyof ServicePackageFormErrors
            ] = [];
        }

        errors[
            field as keyof ServicePackageFormErrors
        ]?.push(issue.message);
    }

    return errors;
}

function createSlug(
    value: string,
): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function createUniquePackageSlug(
    name: string,
): Promise<string> {
    const generatedSlug = createSlug(name);
    const baseSlug =
        generatedSlug || "package";

    let slug = baseSlug;
    let number = 2;

    while (true) {
        const existingPackage =
            await prisma.servicePackage.findUnique({
                where: {
                    slug,
                },

                select: {
                    id: true,
                },
            });

        if (!existingPackage) {
            return slug;
        }

        slug = `${baseSlug}-${number}`;
        number += 1;
    }
}

// --- Create package ---
export async function createServicePackage(
    _previousState: ServicePackageFormState,
    formData: FormData,
): Promise<ServicePackageFormState> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const rawValues =
        getServicePackageFormValues(formData);

    const validationResult =
        servicePackageSchema.safeParse(
            rawValues,
        );

    if (!validationResult.success) {
        return {
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

    const slug =
        await createUniquePackageSlug(
            validatedData.name,
        );

    try {
        await prisma.servicePackage.create({
            data: {
                name: validatedData.name,
                slug,

                shortDescription:
                    validatedData.shortDescription ??
                    null,

                description:
                    validatedData.description ??
                    null,

                priceLabel:
                    validatedData.priceLabel ??
                    null,

                durationLabel:
                    validatedData.durationLabel ??
                    null,

                features:
                    validatedData.features,

                status:
                    validatedData.status,

                publishedAt:
                    validatedData.status ===
                        "PUBLISHED"
                        ? new Date()
                        : null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to create service package:",
            error,
        );

        return {
            message:
                "The package could not be created. Please try again.",
            values: rawValues,
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    revalidatePath("/");
    revalidatePath("/packages");

    redirect("/admin/packages");
}

// --- Update package ---
export async function updateServicePackage(
    packageId: string,
    _previousState: ServicePackageFormState,
    formData: FormData,
): Promise<ServicePackageFormState> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!packageId.trim()) {
        return {
            message:
                "A valid package ID is required.",
        };
    }

    const rawValues =
        getServicePackageFormValues(formData);

    const validationResult =
        servicePackageSchema.safeParse(
            rawValues,
        );

    if (!validationResult.success) {
        return {
            message:
                "Please correct the highlighted fields.",
            errors: getFieldErrors(
                validationResult.error.issues,
            ),
            values: rawValues,
        };
    }

    const existingPackage =
        await prisma.servicePackage.findUnique({
            where: {
                id: packageId,
            },

            select: {
                id: true,
                slug: true,
                status: true,
                publishedAt: true,
            },
        });

    if (!existingPackage) {
        return {
            message:
                "The selected package could not be found.",
            values: rawValues,
        };
    }

    const validatedData =
        validationResult.data;

    let publishedAt =
        existingPackage.publishedAt;

    if (
        existingPackage.status === "DRAFT" &&
        validatedData.status ===
        "PUBLISHED"
    ) {
        publishedAt = new Date();
    }

    if (
        validatedData.status === "DRAFT"
    ) {
        publishedAt = null;
    }

    try {
        await prisma.servicePackage.update({
            where: {
                id: existingPackage.id,
            },

            data: {
                name: validatedData.name,

                shortDescription:
                    validatedData.shortDescription ??
                    null,

                description:
                    validatedData.description ??
                    null,

                priceLabel:
                    validatedData.priceLabel ??
                    null,

                durationLabel:
                    validatedData.durationLabel ??
                    null,

                features:
                    validatedData.features,

                status:
                    validatedData.status,

                publishedAt,
            },
        });
    } catch (error) {
        console.error(
            "Failed to update service package:",
            error,
        );

        return {
            message:
                "The package could not be updated. Please try again.",
            values: rawValues,
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    revalidatePath(
        `/admin/packages/${existingPackage.id}/edit`,
    );
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath(
        `/packages/${existingPackage.slug}`,
    );

    redirect(
        `/admin/packages/${existingPackage.id}/edit`,
    );
}

// --- Delete package ---
export async function deleteServicePackage(
    packageId: string,
): Promise<DeleteServicePackageResult> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!packageId.trim()) {
        return {
            success: false,
            message:
                "A valid package ID is required.",
        };
    }

    const existingPackage =
        await prisma.servicePackage.findUnique({
            where: {
                id: packageId,
            },

            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

    if (!existingPackage) {
        return {
            success: false,
            message:
                "The selected package could not be found.",
        };
    }

    try {
        await prisma.servicePackage.delete({
            where: {
                id: existingPackage.id,
            },
        });
    } catch (error) {
        console.error(
            "Failed to delete service package:",
            error,
        );

        return {
            success: false,
            message:
                "The package could not be deleted. Please try again.",
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath(
        `/packages/${existingPackage.slug}`,
    );

    return {
        success: true,
    };
}