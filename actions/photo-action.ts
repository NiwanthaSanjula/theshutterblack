"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/require-admin";

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
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
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

export type SaveUploadedPhotosBatchInput = {
    albumId: string;
    photos: Array<{
        publicId: string;
        secureUrl: string;
        width: number | null;
        height: number | null;
        format: string | null;
        fileSize: number | null;
    }>;
};

export type PhotosBatchActionResult = {
    success: boolean;
    message?: string;
    savedCount?: number;
};

export async function saveUploadedPhotosBatch(
    input: SaveUploadedPhotosBatchInput,
): Promise<PhotosBatchActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    if (!input.albumId || !input.photos || input.photos.length === 0) {
        return {
            success: false,
            message: "Album ID and uploaded photo details are required.",
        };
    }

    // Validate that all secureUrls are from Cloudinary and formats are allowed
    for (const photo of input.photos) {
        if (!photo.secureUrl.startsWith("https://res.cloudinary.com/")) {
            return {
                success: false,
                message: "One or more image URLs are invalid.",
            };
        }

        if (
            photo.format &&
            !allowedFormats.has(photo.format.toLocaleLowerCase())
        ) {
            return {
                success: false,
                message: `The image format "${photo.format}" is not supported.`,
            };
        }
    }

    const album = await prisma.album.findUnique({
        where: {
            id: input.albumId,
        },
        select: {
            id: true,
            title: true,
            slug: true,
        },
    });

    if (!album) {
        return {
            success: false,
            message: "The selected album could not be found.",
        };
    }

    // Filter out photos that have already been saved to the database (check unique publicid)
    const publicIds = input.photos.map((p) => p.publicId);
    const existingPhotos = await prisma.photo.findMany({
        where: {
            publicid: { in: publicIds },
        },
        select: {
            publicid: true,
        },
    });

    const existingPublicIds = new Set(existingPhotos.map((p) => p.publicid));
    const photosToInsert = input.photos.filter(
        (p) => !existingPublicIds.has(p.publicId),
    );

    if (photosToInsert.length === 0) {
        return {
            success: true,
            savedCount: 0,
        };
    }

    // Get the current displayOrder boundary
    const lastPhoto = await prisma.photo.findFirst({
        where: {
            albumId: album.id,
        },
        orderBy: {
            displayOrder: "desc",
        },
        select: {
            displayOrder: true,
        },
    });

    let displayOrderStart = (lastPhoto?.displayOrder ?? -1) + 1;

    try {
        await prisma.$transaction(async (tx) => {
            for (const p of photosToInsert) {
                await tx.photo.create({
                    data: {
                        albumId: album.id,
                        publicid: p.publicId,
                        secureUrl: p.secureUrl,
                        width: validatePositiveInteger(p.width) ? p.width : null,
                        height: validatePositiveInteger(p.height) ? p.height : null,
                        fileSize: validatePositiveInteger(p.fileSize) ? p.fileSize : null,
                        format: p.format?.toLocaleLowerCase() ?? null,
                        displayOrder: displayOrderStart++,
                        isVisible: true,
                        isCover: false,
                        altText: `${album.title} photograph`,
                    },
                });
            }
        });

        revalidatePath("/admin");
        revalidatePath("/admin/albums");
        revalidatePath(`/admin/albums/${album.id}/photos`);
        revalidatePath("/albums");
        revalidatePath(`/albums/${album.slug}`);

        return {
            success: true,
            savedCount: photosToInsert.length,
        };
    } catch (error) {
        console.error("Failed to save uploaded photos batch:", error);

        // Attempt to clean up the newly uploaded files from Cloudinary
        for (const p of photosToInsert) {
            try {
                await cloudinary.uploader.destroy(p.publicId, {
                    resource_type: "image",
                    invalidate: true,
                });
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up Cloudinary photo after database failure:",
                    p.publicId,
                    cleanupError,
                );
            }
        }

        return {
            success: false,
            message:
                "The database save operation failed. The uploaded photos were cleaned up from Cloudinary.",
        };
    }
}

export async function deletePhoto(
    photoId: string,
): Promise<PhotoActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const normalizedPhotoId = photoId.trim();

    if (!normalizedPhotoId) {
        return {
            success: false,
            message: "Photo ID is required"
        };
    }

    const photo = await prisma.photo.findUnique({
        where: {
            id: normalizedPhotoId,
        },

        select: {
            id: true,
            publicid: true,
            albumId: true,
            isCover: true,
            album: {
                select: {
                    slug: true,
                }
            }
        }
    });

    if (!photo) {
        return {
            success: false,
            message: "The photo you are trying to delete could not be found."
        };
    }

    try {
        const cloudinaryResult = await cloudinary.uploader.destroy(
            photo.publicid,
            {
                resource_type: "image",
                invalidate: true,
            }
        );

        const cloudinaryDeletionSucceeded =
            cloudinaryResult.result === "ok" ||
            cloudinaryResult.result === "not found";

        if (!cloudinaryDeletionSucceeded) {
            console.error(
                "Cloudinary did not confirm photo deletion.",
                cloudinaryResult
            );

            return {
                success: false,
                message: "Cloudinary could not delete this image. Please try again."
            };
        }

        await prisma.photo.delete({
            where: {
                id: photo.id
            },
        });

        /**
         * This prepares the system for the upcomming album-cover feature
         */
        if (photo.isCover) {
            const nextCoverPhoto = await prisma.photo.findFirst({
                where: {
                    albumId: photo.albumId,
                    isVisible: true,
                },

                orderBy: [
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "asc"
                    }
                ],

                select: { id: true },
            });

            if (nextCoverPhoto) {
                await prisma.photo.update({
                    where: {
                        id: nextCoverPhoto.id,
                    },
                    data: {
                        isCover: true
                    }
                });
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/albums");
        if (photo.albumId) {
            revalidatePath(`/admin/albums/${photo.albumId}`, "layout");
            revalidatePath(`/admin/albums/${photo.albumId}/photos`);
        }

        revalidatePath("/");
        revalidatePath("/albums");
        if (photo.album?.slug) {
            revalidatePath(`/albums/${photo.album.slug}`);
        }

        return {
            success: true,
        };



    } catch (error) {
        console.error("Failed to delete photo:", error);

        return {
            success: false,
            message:
                "The photograph could not be deleted. Please try again.",
        };
    }
}

export async function setAlbumCover(
    photoId: string,
): Promise<PhotoActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }

    const normalizedPhotoId = photoId.trim();

    if (!normalizedPhotoId) {
        return {
            success: false,
            message: "A valid photo ID is required.",
        };
    }

    const photo = await prisma.photo.findUnique({
        where: {
            id: normalizedPhotoId,
        },

        select: {
            id: true,
            albumId: true,
            isVisible: true,
            isCover: true,

            album: {
                select: {
                    slug: true,
                },
            },
        }
    })

    if (!photo) {
        return {
            success: false,
            message: "This photograph could not be found.",
        };
    }

    if (!photo.isVisible) {
        return {
            success: false,
            message:
                "A hidden photograph cannot be used as the album cover.",
        };
    }

    if (photo.isCover) {
        return {
            success: true,
            photoId: photo.id,
        };
    }

    try {
        await prisma.$transaction([
            prisma.photo.updateMany({
                where: {
                    albumId: photo.albumId,
                    isCover: true,
                },

                data: {
                    isCover: false,
                }
            }),

            prisma.photo.update({
                where: {
                    id: photo.id,
                },

                data: {
                    isCover: true,
                }
            })
        ])

        revalidatePath("/admin");
        revalidatePath("/admin/albums");

        revalidatePath(
            `/admin/albums/${photo.albumId}`,
            "layout",
        );

        revalidatePath(
            `/admin/albums/${photo.albumId}/photos`,
        );

        revalidatePath("/");
        revalidatePath("/albums");
        if (photo.album?.slug) {
            revalidatePath(`/albums/${photo.album.slug}`);
        }

        return {
            success: true,
            photoId: photo.id,
        };

    } catch (error) {
        console.error(
            "Failed to set album cover:",
            error,
        );

        return {
            success: false,
            message:
                "The album cover could not be changed. Please try again.",
        };
    }



}

export async function togglePhotoVisibility(
    photoId: string
): Promise<PhotoActionResult> {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return {
            success: false,
            message:
                "Your administrator session is missing or has expired. Sign in again.",
        };
    }
    const normalizedPhotoId = photoId.trim();

    if (!normalizedPhotoId) {
        return {
            success: false,
            message: "A valid photo ID is required"
        };
    }

    const photo = await prisma.photo.findUnique({
        where: {
            id: normalizedPhotoId
        },

        select: {
            id: true,
            albumId: true,
            isVisible: true,
            isCover: true,

            album: {
                select: {
                    slug: true,
                },
            },
        },
    });

    if (!photo) {
        return {
            success: true,
            message: "This image could not be found",
        };
    }

    const shouldBecomeVisible = !photo.isVisible;

    try {
        /**
         * Showing a hidden photograph
         */
        if (shouldBecomeVisible) {
            const currentVisibleCover = await prisma.photo.findFirst({
                where: {
                    albumId: photo.albumId,
                    isCover: true,
                    isVisible: true
                },

                select: {
                    id: true,
                },
            });

            /**
             * If the album has no visible cover, make this newly shown image the cover
             */
            if (!currentVisibleCover) {
                await prisma.$transaction([
                    prisma.photo.updateMany({
                        where: {
                            albumId: photo.albumId,
                            isCover: true
                        },
                        data: {
                            isCover: false
                        }
                    }),

                    prisma.photo.update({
                        where: {
                            id: photo.id,
                        },
                        data: {
                            isCover: true,
                            isVisible: true
                        }
                    })
                ])
            } else {
                await prisma.photo.update({
                    where: {
                        id: photo.id,
                    },

                    data: {
                        isVisible: true,
                        isCover: false
                    },
                });
            }
        }

        /**
         * Hiding the current cover image
         */
        if (!shouldBecomeVisible && photo.isCover) {
            const replacementCover =
                await prisma.photo.findFirst({
                    where: {
                        albumId: photo.albumId,
                        id: {
                            not: photo.id,
                        },
                        isVisible: true
                    },

                    orderBy: [
                        {
                            displayOrder: "asc",
                        },
                        {
                            createdAt: "asc",
                        },
                    ],

                    select: {
                        id: true,
                    },
                });

            if (replacementCover) {
                await prisma.$transaction([
                    prisma.photo.update({
                        where: {
                            id: photo.id,
                        },

                        data: {
                            isVisible: false,
                            isCover: false
                        },
                    }),

                    prisma.photo.update({
                        where: {
                            id: replacementCover.id,

                        },

                        data: {
                            isCover: true,
                        },
                    }),
                ]);
            } else {
                await prisma.photo.update({
                    where: {
                        id: photo.id,
                    },

                    data: {
                        isVisible: false,
                        isCover: false
                    },
                });
            }
        }

        /**
         * Hiding a normal non cover image
         */
        if (!shouldBecomeVisible && !photo.isCover) {
            await prisma.photo.update({
                where: {
                    id: photo.id,
                },

                data: {
                    isVisible: false,
                    isCover: false,
                },
            });
        }

        revalidatePath("/admin");
        revalidatePath("/admin/albums");

        revalidatePath(
            `/admin/albums/${photo.albumId}`,
            "layout",
        );

        revalidatePath(
            `/admin/albums/${photo.albumId}/photos`,
        );

        revalidatePath("/");
        revalidatePath("/albums");
        if (photo.album) {
            revalidatePath(`/albums/${photo.album.slug}`);
        }

        return {
            success: true,
            photoId: photo.id,
        };


    } catch (error) {
        console.error(
            "Failed to change photo visibility:",
            error,
        );

        return {
            success: false,
            message:
                "The photograph visibility could not be changed. Please try again.",
        };

    }
}