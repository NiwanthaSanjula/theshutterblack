"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SaveUploadedPhotoInput = {
    albumId: string;
    publicId: string;
    secureUrl: string;
    width: number | null;
    height: number | null;
    format: string | null;
    fileSize: number | null;
};

export type PhotoActionResult = {
    success: boolean;
    message?: string;
    photoId?: string
};

const allowedFormats = new Set([
    "jpg",
    "jpeg",
    "png",
    "webp",
]);

function validatePositiveInteger(
    value: number | null,
): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) && value > 0
    )
}

export async function saveUploadedPhoto(
    input: SaveUploadedPhotoInput,
): Promise<PhotoActionResult> {
    /**
     * Tempory restriction untill authentication is added.
    */
    if (process.env.NODE_ENV === "production") {
        return {
            success: false,
            message: "Photo saving requires admin authentication is production."
        };
    }

    if (!input.albumId || !input.publicId) {
        return {
            success: false,
            message: "Album ID and Cloudinary public ID are required."
        };
    }

    if (
        !input.secureUrl.startsWith("https://res.cloudinary.com/")
    ) {
        return {
            success: false,
            message: "The upload image URL is invalid"
        };
    }

    if (
        input.format &&
        !allowedFormats.has(input.format.toLocaleLowerCase())
    ) {
        return {
            success: false,
            message: "The uploaded image format is not supported."
        };
    }

    const album = await prisma.album.findUnique({
        where: {
            id: input.albumId,
        },

        select: {
            id: true,
            title: true,
            slug: true
        },
    });

    if (!album) {
        return {
            success: false,
            message: "The selected album could not be found."
        };
    }

    const existingPhoto = await prisma.photo.findUnique({
        where: {
            publicid: input.publicId,
        },

        select: {
            id: true,
        }
    });

    if (existingPhoto) {
        return {
            success: true,
            photoId: existingPhoto.id
        };
    }

    const lastPhoto = await prisma.photo.findFirst({
        where: {
            albumId: album.id
        },

        orderBy: {
            displayOrder: "desc"
        },

        select: {
            displayOrder: true,
        },
    });

    const displayOrder = (lastPhoto?.displayOrder ?? -1) + 1;

    try {
        const photo = await prisma.photo.create({
            data: {
                albumId: album.id,
                publicid: input.publicId,
                secureUrl: input.secureUrl,
                width: validatePositiveInteger(input.width) ? input.width : null,
                height: validatePositiveInteger(input.height) ? input.height : null,
                fileSize: validatePositiveInteger(input.fileSize) ? input.fileSize : null,
                format: input.format?.toLocaleLowerCase() ?? null,
                displayOrder,
                isVisible: true,
                isCover: false,
                altText: `${album.title} photograph`
            },

            select: {
                id: true,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/admin/albums");
        revalidatePath(`/admin/albums/${album.id}/photos`,);
        revalidatePath("/albums");
        revalidatePath(`/albums/${album.slug}`);

        return {
            success: true,
            photoId: photo.id
        }

    } catch (error) {
        console.error(
            "Failed to save uploaded photo:",
            error
        );

        return {
            success: false,
            message: "The image uploaded to Cloudinary, but its database record could not be saved."
        };
    }


}

