"use server";

import { cloudinary } from "@/lib/cloudinary";
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

export async function deletePhoto(
    photoId: string,
): Promise<PhotoActionResult> {
    /**
     *  Temopory restriction untill authentication is added.
     */
    if (process.env.NODE_ENV === "production") {
        return {
            success: false,
            message: "Photo deletion requires admin authentication in production."
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
    /**
     * Tempory restriction until authentication is added.
     */
    if (process.env.NODE_ENV === "production") {
        return {
            success: false,
            message:
                "Cover selection requires admin authentication in production.",
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
    /**
   * Temporary restriction until authentication is added.
   */
    if (process.env.NODE_ENV === "production") {
        return {
            success: false,
            message:
                "Photo visibility changes require admin authentication in production.",
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