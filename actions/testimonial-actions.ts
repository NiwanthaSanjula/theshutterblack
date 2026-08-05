"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/require-admin";
import { cloudinary } from "@/lib/cloudinary";

import { prisma } from "@/lib/prisma";
import {
    publicTestimonialSchema,
    testimonialImageSchema,
} from "@/lib/validations/testimonial";

export type PublicTestimonialFormValues = {
    name: string;
    email: string;
    rating: string;
    message: string;
    consentToPublish: boolean;
};

export type PublicTestimonialFormErrors = {
    name?: string[];
    email?: string[];
    rating?: string[];
    message?: string[];
    consentToPublish?: string[];
};

export type PublicTestimonialFormState = {
    success?: boolean;
    message?: string;
    errors?: PublicTestimonialFormErrors;
    values?: PublicTestimonialFormValues;
};

export type TestimonialAdminResult = {
    success: boolean;
    message?: string;
};

export type SaveTestimonialImageInput = {
    testimonialId: string;
    publicId: string;
};

const TESTIMONIAL_IMAGE_MIN_WIDTH = 1200;
const TESTIMONIAL_IMAGE_MIN_HEIGHT = 675;
const TESTIMONIAL_IMAGE_MIN_RATIO = 1.5;
const TESTIMONIAL_IMAGE_MAX_RATIO = 2;
const TESTIMONIAL_IMAGE_MAX_FILE_SIZE = 10_000_000;

const TESTIMONIAL_IMAGE_ALLOWED_FORMATS =
    new Set([
        "jpg",
        "jpeg",
        "png",
        "webp",
    ]);

async function deleteTestimonialCloudinaryImage(
    publicId: string,
): Promise<boolean> {
    try {
        const result =
            await cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type: "image",
                    type: "upload",
                    invalidate: true,
                },
            );

        return (
            result.result === "ok" ||
            result.result === "not found"
        );
    } catch (error) {
        console.error(
            "Failed to delete testimonial image:",
            {
                publicId,
                error,
            },
        );

        return false;
    }
}

function getPublicTestimonialFormValues(
    formData: FormData,
): PublicTestimonialFormValues {
    return {
        name: String(
            formData.get("name") ?? "",
        ),

        email: String(
            formData.get("email") ?? "",
        ),

        rating: String(
            formData.get("rating") ?? "",
        ),

        message: String(
            formData.get("message") ?? "",
        ),

        consentToPublish:
            formData.get("consentToPublish") ===
            "on",
    };
}

function getFieldErrors(
    issues: {
        path: PropertyKey[];
        message: string;
    }[],
): PublicTestimonialFormErrors {
    const errors: PublicTestimonialFormErrors =
        {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (typeof field !== "string") {
            continue;
        }

        if (!(field in errors)) {
            errors[
                field as keyof PublicTestimonialFormErrors
            ] = [];
        }

        errors[
            field as keyof PublicTestimonialFormErrors
        ]?.push(issue.message);
    }

    return errors;
}

export async function submitTestimonial(
    _previousState: PublicTestimonialFormState,
    formData: FormData,
): Promise<PublicTestimonialFormState> {
    const rawValues =
        getPublicTestimonialFormValues(
            formData,
        );

    /*
     * A hidden honeypot field will be added to
     * the public feedback form.
     *
     * Normal visitors will leave it empty.
     */
    const website = String(
        formData.get("website") ?? "",
    ).trim();

    if (website) {
        /*
         * Return a normal-looking success response.
         * Do not tell automated spam systems that
         * the honeypot detected them.
         */
        return {
            success: true,
            message:
                "Thank you. Your feedback has been submitted for review.",
        };
    }

    const validationResult =
        publicTestimonialSchema.safeParse(
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
        await prisma.testimonial.create({
            data: {
                name: validatedData.name,

                email:
                    validatedData.email ??
                    null,

                rating:
                    validatedData.rating,

                message:
                    validatedData.message,

                consentToPublish:
                    validatedData.consentToPublish,

                /*
                 * Public submissions can never
                 * choose their moderation status.
                 */
                status: "PENDING",

                imageUrl: null,
                imagePublicId: null,
                publishedAt: null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to submit testimonial:",
            error,
        );

        return {
            success: false,
            message:
                "Your feedback could not be submitted. Please try again.",
            values: rawValues,
        };
    }

    revalidatePath("/admin/testimonials");

    return {
        success: true,
        message:
            "Thank you. Your feedback has been submitted for review.",
    };
}

// --- Publish testimonial ---
export async function publishTestimonial(
    testimonialId: string,
): Promise<TestimonialAdminResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!testimonialId.trim()) {
        return {
            success: false,
            message: "A valid testimonial ID is required.",
        };
    }

    const testimonial =
        await prisma.testimonial.findUnique({
            where: {
                id: testimonialId,
            },

            select: {
                id: true,
                consentToPublish: true,
                imageUrl: true,
                imagePublicId: true,
                publishedAt: true,
            },
        });

    if (!testimonial) {
        return {
            success: false,
            message: "The testimonial could not be found.",
        };
    }

    if (!testimonial.consentToPublish) {
        return {
            success: false,
            message:
                "This customer has not given permission to publish the testimonial.",
        };
    }

    if (
        !testimonial.imageUrl ||
        !testimonial.imagePublicId
    ) {
        return {
            success: false,
            message:
                "Upload a testimonial image before publishing.",
        };
    }

    try {
        await prisma.testimonial.update({
            where: {
                id: testimonial.id,
            },

            data: {
                status: "PUBLISHED",

                publishedAt:
                    testimonial.publishedAt ??
                    new Date(),
            },
        });
    } catch (error) {
        console.error(
            "Failed to publish testimonial:",
            error,
        );

        return {
            success: false,
            message:
                "The testimonial could not be published. Please try again.",
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return {
        success: true,
    };
}


// --- Reject testimonial ---
export async function rejectTestimonial(
    testimonialId: string,
): Promise<TestimonialAdminResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!testimonialId.trim()) {
        return {
            success: false,
            message: "A valid testimonial ID is required.",
        };
    }

    const testimonial =
        await prisma.testimonial.findUnique({
            where: {
                id: testimonialId,
            },

            select: {
                id: true,
            },
        });

    if (!testimonial) {
        return {
            success: false,
            message: "The testimonial could not be found.",
        };
    }

    try {
        await prisma.testimonial.update({
            where: {
                id: testimonial.id,
            },

            data: {
                status: "REJECTED",
                publishedAt: null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to reject testimonial:",
            error,
        );

        return {
            success: false,
            message:
                "The testimonial could not be rejected. Please try again.",
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return {
        success: true,
    };
}


// --- Return testimonial to pending ---
export async function moveTestimonialToPending(
    testimonialId: string,
): Promise<TestimonialAdminResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!testimonialId.trim()) {
        return {
            success: false,
            message: "A valid testimonial ID is required.",
        };
    }

    try {
        await prisma.testimonial.update({
            where: {
                id: testimonialId,
            },

            data: {
                status: "PENDING",
                publishedAt: null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to return testimonial to pending:",
            error,
        );

        return {
            success: false,
            message:
                "The testimonial could not be returned to pending.",
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return {
        success: true,
    };
}


// --- Permanently delete testimonial ---
export async function deleteTestimonial(
    testimonialId: string,
): Promise<TestimonialAdminResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!testimonialId.trim()) {
        return {
            success: false,
            message: "A valid testimonial ID is required.",
        };
    }

    const testimonial =
        await prisma.testimonial.findUnique({
            where: {
                id: testimonialId,
            },

            select: {
                id: true,
                imagePublicId: true,
            },
        });

    if (!testimonial) {
        return {
            success: false,
            message: "The testimonial could not be found.",
        };
    }

    if (testimonial.imagePublicId) {
        try {
            const cloudinaryResult =
                await cloudinary.uploader.destroy(
                    testimonial.imagePublicId,
                    {
                        resource_type: "image",
                        type: "upload",
                        invalidate: true,
                    },
                );

            if (
                cloudinaryResult.result !== "ok" &&
                cloudinaryResult.result !== "not found"
            ) {
                console.error(
                    "Testimonial image deletion failed:",
                    {
                        testimonialId: testimonial.id,
                        publicId:
                            testimonial.imagePublicId,
                        cloudinaryResult,
                    },
                );

                return {
                    success: false,
                    message:
                        "The testimonial image could not be removed from Cloudinary. The testimonial was not deleted.",
                };
            }
        } catch (error) {
            console.error(
                "Testimonial image deletion failed:",
                {
                    testimonialId: testimonial.id,
                    publicId:
                        testimonial.imagePublicId,
                    error,
                },
            );

            return {
                success: false,
                message:
                    "The testimonial image could not be removed from Cloudinary. The testimonial was not deleted.",
            };
        }
    }

    try {
        await prisma.testimonial.delete({
            where: {
                id: testimonial.id,
            },
        });
    } catch (error) {
        console.error(
            "Failed to delete testimonial:",
            error,
        );

        return {
            success: false,
            message:
                "The testimonial could not be deleted. Please try again.",
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return {
        success: true,
    };
}

// --- Save or replace testimonial image ---
export async function saveTestimonialImage(
    input: SaveTestimonialImageInput,
): Promise<TestimonialAdminResult> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const validationResult =
        testimonialImageSchema.safeParse(
            input,
        );

    if (!validationResult.success) {
        return {
            success: false,
            message:
                validationResult.error.issues[0]
                    ?.message ??
                "Invalid testimonial image information.",
        };
    }

    const {
        testimonialId,
        publicId,
    } = validationResult.data;

    const expectedPublicIdPrefix =
        `the-shutter-black/testimonials/${testimonialId}/`;

    if (
        !publicId.startsWith(
            expectedPublicIdPrefix,
        )
    ) {
        return {
            success: false,
            message:
                "The uploaded image is not in the correct testimonial folder.",
        };
    }

    const testimonial =
        await prisma.testimonial.findUnique({
            where: {
                id: testimonialId,
            },

            select: {
                id: true,
                imagePublicId: true,
            },
        });

    if (!testimonial) {
        await deleteTestimonialCloudinaryImage(
            publicId,
        );

        return {
            success: false,
            message:
                "The selected testimonial could not be found.",
        };
    }

    let secureUrl: string | null = null;
    let width = 0;
    let height = 0;
    let fileSize = 0;
    let format = "";

    try {
        /*
         * Verify the real uploaded asset directly
         * through Cloudinary instead of trusting
         * browser-provided metadata.
         */
        const resource =
            await cloudinary.api.resource(
                publicId,
                {
                    resource_type: "image",
                    type: "upload",
                },
            );

        secureUrl =
            typeof resource.secure_url ===
                "string"
                ? resource.secure_url
                : null;

        width = Number(resource.width);
        height = Number(resource.height);
        fileSize = Number(resource.bytes);

        format =
            typeof resource.format === "string"
                ? resource.format.toLowerCase()
                : "";
    } catch (error) {
        console.error(
            "Failed to verify testimonial image:",
            {
                testimonialId,
                publicId,
                error,
            },
        );

        await deleteTestimonialCloudinaryImage(
            publicId,
        );

        return {
            success: false,
            message:
                "The uploaded image could not be verified.",
        };
    }

    const aspectRatio =
        height > 0
            ? width / height
            : 0;

    const dimensionsAreValid =
        Number.isFinite(width) &&
        Number.isFinite(height) &&
        width >=
        TESTIMONIAL_IMAGE_MIN_WIDTH &&
        height >=
        TESTIMONIAL_IMAGE_MIN_HEIGHT;

    const ratioIsValid =
        aspectRatio >=
        TESTIMONIAL_IMAGE_MIN_RATIO &&
        aspectRatio <=
        TESTIMONIAL_IMAGE_MAX_RATIO;

    const formatIsValid =
        TESTIMONIAL_IMAGE_ALLOWED_FORMATS.has(
            format,
        );

    const fileSizeIsValid =
        Number.isFinite(fileSize) &&
        fileSize > 0 &&
        fileSize <=
        TESTIMONIAL_IMAGE_MAX_FILE_SIZE;

    if (
        !secureUrl ||
        !dimensionsAreValid ||
        !ratioIsValid ||
        !formatIsValid ||
        !fileSizeIsValid
    ) {
        await deleteTestimonialCloudinaryImage(
            publicId,
        );

        return {
            success: false,
            message:
                "Use a landscape JPEG, PNG or WebP image between 3:2 and 2:1, at least 1200 × 675 pixels and no larger than 10 MB.",
        };
    }

    try {
        await prisma.testimonial.update({
            where: {
                id: testimonial.id,
            },

            data: {
                imageUrl: secureUrl,
                imagePublicId: publicId,
            },
        });
    } catch (error) {
        console.error(
            "Failed to save testimonial image:",
            {
                testimonialId,
                publicId,
                error,
            },
        );

        await deleteTestimonialCloudinaryImage(
            publicId,
        );

        return {
            success: false,
            message:
                "The testimonial image could not be saved.",
        };
    }

    /*
     * Delete the previous image only after
     * the new image is safely stored.
     */
    if (
        testimonial.imagePublicId &&
        testimonial.imagePublicId !==
        publicId
    ) {
        const oldImageDeleted =
            await deleteTestimonialCloudinaryImage(
                testimonial.imagePublicId,
            );

        if (!oldImageDeleted) {
            console.error(
                "Old testimonial image cleanup failed:",
                {
                    testimonialId,
                    oldPublicId:
                        testimonial.imagePublicId,
                },
            );
        }
    }

    revalidatePath("/admin");
    revalidatePath(
        "/admin/testimonials",
    );
    revalidatePath("/");

    return {
        success: true,
    };
}

// --- Remove testimonial image ---
export async function removeTestimonialImage(
    testimonialId: string,
): Promise<TestimonialAdminResult> {
    const adminSession =
        await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!testimonialId.trim()) {
        return {
            success: false,
            message:
                "A valid testimonial ID is required.",
        };
    }

    const testimonial =
        await prisma.testimonial.findUnique({
            where: {
                id: testimonialId,
            },

            select: {
                id: true,
                status: true,
                imagePublicId: true,
            },
        });

    if (!testimonial) {
        return {
            success: false,
            message:
                "The selected testimonial could not be found.",
        };
    }

    if (!testimonial.imagePublicId) {
        return {
            success: true,
        };
    }

    const previousPublicId =
        testimonial.imagePublicId;

    try {
        await prisma.testimonial.update({
            where: {
                id: testimonial.id,
            },

            data: {
                imageUrl: null,
                imagePublicId: null,

                /*
                 * A published testimonial cannot
                 * remain public without an image.
                 */
                ...(testimonial.status ===
                    "PUBLISHED"
                    ? {
                        status:
                            "PENDING" as const,
                        publishedAt: null,
                    }
                    : {}),
            },
        });
    } catch (error) {
        console.error(
            "Failed to remove testimonial image:",
            {
                testimonialId,
                error,
            },
        );

        return {
            success: false,
            message:
                "The testimonial image could not be removed.",
        };
    }

    const cloudinaryImageDeleted =
        await deleteTestimonialCloudinaryImage(
            previousPublicId,
        );

    revalidatePath("/admin");
    revalidatePath(
        "/admin/testimonials",
    );
    revalidatePath("/");

    if (!cloudinaryImageDeleted) {
        return {
            success: true,
            message:
                "The image was removed from the testimonial, but Cloudinary cleanup could not be confirmed.",
        };
    }

    return {
        success: true,
        message:
            testimonial.status ===
                "PUBLISHED"
                ? "The image was removed and the testimonial was returned to pending."
                : "The testimonial image was removed.",
    };
}