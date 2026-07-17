"use server";

import { redirect, } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { albumSchema } from "@/lib/validations/album";

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

    redirect("/admin/albums");
}


// --- Update Album ---
export async function updateAlbum(
    albumId: string,
    _previousState: AlbumFormState,
    formData: FormData,
): Promise<AlbumFormState> {
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
    revalidatePath("/");
    revalidatePath("/albums");

    redirect("/admin/albums");
}


