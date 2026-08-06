"use server";

import { redirect, } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { albumSchema } from "@/lib/validations/album";
import { cloudinary } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth/require-admin";

export type AlbumFormValues = {
    title: string;
    description: string;
    category: string;
    location: string;
    eventDate: string;
    status: "DRAFT" | "PUBLISHED";
    isFeatured: boolean;
}

export type AlbumFormErrors = {
    title?: string[];
    description?: string[];
    category?: string[];
    location?: string[];
    eventDate?: string[];
    status?: string[];
    isFeatured?: string[];
};

export type AlbumFormState = {
    message?: string;
    errors?: AlbumFormErrors;
    values?: AlbumFormValues
};

export type DeleteAlbumResult = {
    success: boolean;
    message?: string;
}
export type AlbumFeaturedImageResult = {
    success: boolean;
    message?: string;
};

export type SaveAlbumFeaturedImageInput = {
    albumId: string;
    publicId: string;
};

// --- Create a base slug ---
function createSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// -- Create a unique slug. If it exists in db, generate new one and try again ---
async function createUniqueSlug(
    title: string,
    excludedAlbumId?: string,
): Promise<string> {

    const generatedSlug = createSlug(title);
    const baseSlug = generatedSlug || "album";

    let slug = baseSlug;
    let number = 2;

    while (true) {
        const existingAlbum = await prisma.album.findFirst({
            where: {
                slug,
                ...(excludedAlbumId
                    ? {
                        NOT: {
                            id: excludedAlbumId
                        },
                    }
                    : {})
            },

            select: {
                id: true
            },
        });

        if (!existingAlbum) {
            return slug;
        }

        slug = `${baseSlug}-${number}`;
        number += 1;
    }
}

// --- Extract form values ---
function getAlbumFormValues(formData: FormData): AlbumFormValues {
    return {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        category: String(formData.get("category") ?? ""),
        location: String(formData.get("location") ?? ""),
        eventDate: String(formData.get("eventDate") ?? ""),
        status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        isFeatured: formData.get("isFeatured") === "on",
    };
}

// --- Cloudinary Delete Album Helper ---
const CLOUDINARY_DELETE_BATCH_SIZE = 100;

function createBatches<T>(
    items: T[],
    batchSize: number,
): T[][] {
    const batches: T[][] = [];

    for (
        let startIndex = 0;
        startIndex < items.length;
        startIndex += batchSize
    ) {
        batches.push(
            items.slice(
                startIndex,
                startIndex + batchSize
            ),
        );
    }

    return batches;
}

const FEATURED_IMAGE_MIN_WIDTH = 1200;
const FEATURED_IMAGE_MIN_HEIGHT = 600;
const FEATURED_IMAGE_MIN_RATIO = 1.5;
const FEATURED_IMAGE_MAX_RATIO = 2;
const FEATURED_IMAGE_MAX_FILE_SIZE = 10_000_000;

const FEATURED_IMAGE_ALLOWED_FORMATS = new Set([
    "jpg",
    "jpeg",
    "png",
    "webp",
]);

async function deleteSingleCloudinaryImage(
    publicId: string,
): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(
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
            "Failed to delete Cloudinary image:",
            {
                publicId,
                error,
            },
        );

        return false;
    }
}

/* 
Takes that raw array and loops through it. It checks path[0] for each item,
groups them into an empty object, and outputs a clean mapping.
*/
function getFieldErrors(
    issues: {
        path: PropertyKey[];
        message: string;
    }[],
): AlbumFormErrors {
    const errors: AlbumFormErrors = {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (typeof field !== 'string') {
            continue
        }

        if (!(field in errors)) {
            errors[field as keyof AlbumFormErrors] = [];
        }

        errors[field as keyof AlbumFormErrors]?.push(issue.message);
    }

    return errors;
}

// --- Create New Album ---
export async function createAlbum(
    _previousState: AlbumFormState,
    formData: FormData,
): Promise<AlbumFormState> {

    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {

            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const rawValues = getAlbumFormValues(formData);
    const validationResult = albumSchema.safeParse(rawValues);

    if (!validationResult.success) {
        return {
            message: "Please correct the highlighted fields",
            errors: getFieldErrors(validationResult.error.issues),
            values: rawValues
        };
    }

    const validatedData = validationResult.data;
    const slug = await createUniqueSlug(validatedData.title)

    try {
        await prisma.album.create({
            data: {
                title: validatedData.title,
                slug,
                description: validatedData.description,
                category: validatedData.category,
                location: validatedData.location,
                eventDate: validatedData.eventDate,
                status: validatedData.status,
                isFeatured: validatedData.isFeatured,

                publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
            },
        });
    } catch (error) {
        console.error("Failed to create album:", error);

        return {
            message: "The album could not be created. Please try again.",
            values: rawValues,
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/albums");
    revalidatePath("/albums");
    revalidatePath("/");

    redirect("/admin/albums");
}

// --- Update Album ---
export async function updateAlbum(
    albumId: string,
    _previousState: AlbumFormState,
    formData: FormData,
): Promise<AlbumFormState> {

    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const rawValues = getAlbumFormValues(formData);
    const validationResult = albumSchema.safeParse(rawValues);

    if (!validationResult.success) {
        return {
            message: "Please correct the highighted fields",
            errors: getFieldErrors(validationResult.error.issues),
            values: rawValues
        };
    }

    const existingAlbum = await prisma.album.findUnique({
        where: {
            id: albumId,
        },

        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            publishedAt: true
        },
    });

    if (!existingAlbum) {
        return {
            message: "Album not found",
            values: rawValues,
        }
    }

    const validatedData = validationResult.data;

    const titleHasChanged =
        existingAlbum.title !== validatedData.title;

    const slug = titleHasChanged
        ? await createUniqueSlug(validatedData.title, albumId)
        : existingAlbum.slug;

    let publishedAt = existingAlbum.publishedAt

    if (
        existingAlbum.status === "DRAFT" &&
        validatedData.status === "PUBLISHED"
    ) {
        publishedAt = new Date();
    }

    if (validatedData.status === "DRAFT") {
        publishedAt = null;
    }

    try {
        await prisma.album.update({
            where: {
                id: albumId
            },

            data: {
                title: validatedData.title,
                slug,
                description: validatedData.description,
                category: validatedData.category,
                location: validatedData.location,
                eventDate: validatedData.eventDate,
                status: validatedData.status,
                isFeatured: validatedData.isFeatured,
                publishedAt,
            },
        });

    } catch (error) {
        console.error("Failed to update album: ", error);

        return {
            message: "The album could not be updated.Please try again",
            values: rawValues
        };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/albums");
    revalidatePath(`/admin/albums/${albumId}/edit`);
    revalidatePath("/");
    revalidatePath("/albums");
    revalidatePath(`/albums/${slug}`);

    redirect(`/admin/albums/${albumId}/edit`);
}

// --- Save or replace album featured image ---
export async function saveAlbumFeaturedImage(
    input: SaveAlbumFeaturedImageInput,
): Promise<AlbumFeaturedImageResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const albumId = input.albumId.trim();
    const publicId = input.publicId.trim();

    if (!albumId || !publicId) {
        return {
            success: false,
            message:
                "The album ID and uploaded image ID are required.",
        };
    }

    const expectedPublicIdPrefix =
        `the-shutter-black/albums/${albumId}/featured/`;

    /*
     * Never inspect or delete an asset outside the expected
     * featured-image folder.
     */
    if (!publicId.startsWith(expectedPublicIdPrefix)) {
        return {
            success: false,
            message:
                "The uploaded image is not in the correct album folder.",
        };
    }

    const existingAlbum = await prisma.album.findUnique({
        where: {
            id: albumId,
        },

        select: {
            id: true,
            slug: true,
            featuredImagePublicId: true,
        },
    });

    if (!existingAlbum) {
        await deleteSingleCloudinaryImage(publicId);

        return {
            success: false,
            message: "The selected album does not exist.",
        };
    }

    let verifiedSecureUrl: string | null = null;
    let width = 0;
    let height = 0;
    let fileSize = 0;
    let format = "";

    try {
        /*
         * Read the real asset details directly from Cloudinary.
         * Do not trust dimensions or URLs sent by the browser.
         */
        const resource = await cloudinary.api.resource(
            publicId,
            {
                resource_type: "image",
                type: "upload",
            },
        );

        verifiedSecureUrl =
            typeof resource.secure_url === "string"
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
            "Failed to verify featured image:",
            {
                albumId,
                publicId,
                error,
            },
        );

        return {
            success: false,
            message:
                "The uploaded image could not be verified with Cloudinary.",
        };
    }

    const aspectRatio =
        height > 0 ? width / height : 0;

    const hasValidDimensions =
        Number.isFinite(width) &&
        Number.isFinite(height) &&
        width >= FEATURED_IMAGE_MIN_WIDTH &&
        height >= FEATURED_IMAGE_MIN_HEIGHT;

    const hasValidRatio =
        aspectRatio >= FEATURED_IMAGE_MIN_RATIO &&
        aspectRatio <= FEATURED_IMAGE_MAX_RATIO;

    const hasValidFormat =
        FEATURED_IMAGE_ALLOWED_FORMATS.has(format);

    const hasValidFileSize =
        Number.isFinite(fileSize) &&
        fileSize > 0 &&
        fileSize <= FEATURED_IMAGE_MAX_FILE_SIZE;

    if (
        !verifiedSecureUrl ||
        !hasValidDimensions ||
        !hasValidRatio ||
        !hasValidFormat ||
        !hasValidFileSize
    ) {
        await deleteSingleCloudinaryImage(publicId);

        return {
            success: false,
            message:
                "Use a landscape JPEG, PNG or WebP image between 3:2 and 2:1, at least 1200 × 600 pixels and no larger than 10 MB.",
        };
    }

    try {
        await prisma.album.update({
            where: {
                id: existingAlbum.id,
            },

            data: {
                featuredImageUrl: verifiedSecureUrl,
                featuredImagePublicId: publicId,
            },
        });
    } catch (error) {
        console.error(
            "Failed to save album featured image:",
            {
                albumId,
                publicId,
                error,
            },
        );

        /*
         * Database save failed, so remove the newly uploaded
         * Cloudinary asset to prevent an unused file.
         */
        await deleteSingleCloudinaryImage(publicId);

        return {
            success: false,
            message:
                "The featured image could not be saved. Please try again.",
        };
    }

    /*
     * Delete the previous image only after the new image has
     * been stored successfully in PostgreSQL.
     */
    if (
        existingAlbum.featuredImagePublicId &&
        existingAlbum.featuredImagePublicId !== publicId
    ) {
        const oldImageDeleted =
            await deleteSingleCloudinaryImage(
                existingAlbum.featuredImagePublicId,
            );

        if (!oldImageDeleted) {
            console.error(
                "The old featured image could not be cleaned up:",
                {
                    albumId,
                    oldPublicId:
                        existingAlbum.featuredImagePublicId,
                },
            );
        }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/albums");
    revalidatePath(
        `/admin/albums/${existingAlbum.id}/edit`,
    );
    revalidatePath("/");
    revalidatePath("/albums");
    revalidatePath(
        `/albums/${existingAlbum.slug}`,
    );

    return {
        success: true,
    };
}

// --- Remove album featured image ---
export async function removeAlbumFeaturedImage(
    albumId: string,
): Promise<AlbumFeaturedImageResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!albumId.trim()) {
        return {
            success: false,
            message: "A valid album ID is required.",
        };
    }

    const existingAlbum = await prisma.album.findUnique({
        where: {
            id: albumId,
        },

        select: {
            id: true,
            slug: true,
            featuredImagePublicId: true,
        },
    });

    if (!existingAlbum) {
        return {
            success: false,
            message: "The selected album does not exist.",
        };
    }

    if (!existingAlbum.featuredImagePublicId) {
        return {
            success: true,
        };
    }

    const previousPublicId =
        existingAlbum.featuredImagePublicId;

    try {
        /*
         * Remove the database reference first so the website
         * cannot continue showing a deleted Cloudinary image.
         */
        await prisma.album.update({
            where: {
                id: existingAlbum.id,
            },

            data: {
                featuredImageUrl: null,
                featuredImagePublicId: null,
            },
        });
    } catch (error) {
        console.error(
            "Failed to remove featured image from album:",
            {
                albumId,
                error,
            },
        );

        return {
            success: false,
            message:
                "The featured image could not be removed. Please try again.",
        };
    }

    const cloudinaryImageDeleted =
        await deleteSingleCloudinaryImage(
            previousPublicId,
        );

    revalidatePath("/admin");
    revalidatePath("/admin/albums");
    revalidatePath(
        `/admin/albums/${existingAlbum.id}/edit`,
    );
    revalidatePath("/");
    revalidatePath("/albums");
    revalidatePath(
        `/albums/${existingAlbum.slug}`,
    );

    if (!cloudinaryImageDeleted) {
        return {
            success: true,
            message:
                "The featured image was removed from the album, but Cloudinary cleanup could not be confirmed.",
        };
    }

    return {
        success: true,
    };
}

// --- Delete Album ---
export async function deleteAlbum(
    albumId: string,
): Promise<DeleteAlbumResult> {

    if (!albumId) {
        return {
            success: false,
            message: "A valid album ID is required"
        };
    }

    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const existingAlbum = await prisma.album.findUnique({
        where: {
            id: albumId
        },

        select: {
            id: true,
            title: true,
            slug: true,
            featuredImagePublicId: true,

            photos: {
                select: {
                    publicid: true,
                }
            }
        },
    });

    if (!existingAlbum) {
        return {
            success: false,
            message: "This album could not be found."
        };
    }

    try {
        const publicIds = [
            ...existingAlbum.photos.map(
                (photo) => photo.publicid,
            ),

            ...(existingAlbum.featuredImagePublicId
                ? [existingAlbum.featuredImagePublicId]
                : []),
        ];

        const publicIdBatches = createBatches(
            publicIds,
            CLOUDINARY_DELETE_BATCH_SIZE
        );

        /**
         * Delete Cloudinary assets first.
         * 
         * Requests are deliberately processed one by one to avoid sending many destructive operations simultaneously.
        */
        for (const publicIdBatch of publicIdBatches) {
            const cloudinaryResult =
                await cloudinary.api.delete_resources(
                    publicIdBatch,
                    {
                        resource_type: "image",
                        type: "upload",
                        invalidate: true,
                    },
                );

            const deletionStatuses = cloudinaryResult.deleted as | Record<string, string> | undefined;

            const failedPublicIds = publicIdBatch.filter((publicId) => {
                const status = deletionStatuses?.[publicId];

                return (
                    status !== "deleted" &&
                    status !== "not_found"
                );
            });

            if (failedPublicIds.length > 0) {
                console.error(
                    "Cloudinary album deletion failed:",
                    {
                        albumId: existingAlbum.id,
                        failedPublicIds,
                        cloudinaryResult,
                    },
                );

                return {
                    success: false,
                    message: "Some album photographs could not be removed from Cloudinary. The album was not deleted. Please try again."
                }
            }
        }

        /**
         * Only delete the postgreSQL album after all
         * Cloudinary assets are confirmed absent
         * 
         * Related photo rows are deleted automatically through onDelete: Cascase.
         */
        await prisma.album.delete({
            where: {
                id: existingAlbum.id
            },
        });



    } catch (error) {
        console.error("Failed to delete album: ", error);

        return {
            success: false,
            message: "The album could not be deleted. Please try again."
        }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/albums");
    revalidatePath("/");
    revalidatePath("/albums");
    revalidatePath(`/albums/${existingAlbum.slug}`)

    return {
        success: true,
    };
}


